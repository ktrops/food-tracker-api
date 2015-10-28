"use strict";

var fs = require('fs');
var pg = require('pg');
var rl = require('readline');
var db_env;

if (process.env.NODE_ENV == 'production') {
  db_env = process.env.CONSTRING;
} else {
  db_env = 'postgres://localhost:5432/food_expire_development';
}
var product_file = "/Users/ktrops/ada/capstone/food_expire_date/db/FoodKeeper-data-product.csv";
var db = new pg.Client(db_env);
db.on('drain', db.end.bind(db));
db.connect();
//seed_categories is called at the end of the file, but I'm pretty sure db.query automatically runs the COPY statement.
var seed_categories = db.query("COPY categories FROM '/Users/ktrops/ada/capstone/food_expire_date/db/FoodKeeper-data-category.csv' DELIMITERS ',' CSV HEADER;");
//arrayOfData returns an array of arrays of all lines from the file
function arrayOfData(file, callback) {
  //this opens the file and creates a readStream for each line
    var openFile = rl.createInterface({
    input: require('fs').createReadStream(file)
  });

  var allLines = [];
 //This listens for a line event then applies the logic to each line.
  openFile.on('line', function(line) {
   var quotes = line.replace(/"[^"]*"/g, function(byeCommas){return byeCommas.replace(/,/g,';');});
   var splitOnCommas = quotes.split(",");
   allLines.push(splitOnCommas);
  })//When the createInterface is done (i.e. reached the end of the file) it emittes close(), which the 'close' listener listens to.
  .on('close', function() {
    callback(allLines); //allLines is returned when the end of the file is reached.
  });
}

function processCSV(file, db) {
  arrayOfData(file, function(allLines){
    //The first element of allLines are the headers
    var headers = allLines.shift();
    for(var i = 1; i < allLines.length; i++) {
      //iterate through each line lines not including headers.
      var data = allLines[i]
      //check to make sure each line was parsed correctly.
      if (data.length == headers.length) {
        var parse = {};
        for (var j = 0; j < headers.length; j++) {
          //creates a dictionary so that the headers are the keys and the corresponding data in each line are the values.
          parse[headers[j]] = data[j];
        }

        parse['Category_Name [Display ONLY!]'] += ";" + parse['Subcategory_Name [Display ONLY!]']
        // parse.Name +=
        //moving the expiration_dates to one column for each category.
        if (parse.Pantry_Min != '' && parse.DOP_Pantry_Min == '') {
          //In the csv file if there is a Pantry_Min then DOP_Pantry_Min is empty. I want to put data into my database that is simular.
          parse.DOP_Pantry_Min = parse.Pantry_Min;
          parse.DOP_Pantry_Max = parse.Pantry_Max;
          parse.Pantry_Metric = parse.DOP_Pantry_Metric;
        }
        if (parse.Refrigerate_Min != '' && parse.DOP_Refrigerate_Min == '') {
          parse.DOP_Refrigerate_Min = parse.Refrigerate_Min;
          parse.DOP_Refrigerate_Max = parse.Refrigerate_Max;
          parse.DOP_Refrigerate_Metric = parse.Refrigerate_Metric;
        }
        if (parse.Freeze_Min != '' && parse.DOP_Freeze_Min == '') {
          parse.DOP_Freeze_Min = parse.Freeze_Min;
          parse.DOP_Freeze_Max = parse.Freeze_Max;
          parse.DOP_Freeze_Metric = parse.Freeze_Metric;
        }
        //If expiration dates dont exist for these categories initialize them to zero so it's an integer
        //and thus can be saved to the database. The db requires mins and maxs to be an integer.
        if (parse.DOP_Freeze_Min == '') {
          parse.DOP_Freeze_Min = 0;
          parse.DOP_Freeze_Max = 0;
        }
        if (parse.DOP_Pantry_Min == '') {
          parse.DOP_Pantry_Min = 0;
          parse.DOP_Pantry_Max = 0;
        }
        if (parse.DOP_Refrigerate_Min == '') {
          parse.DOP_Refrigerate_Min = 0;
          parse.DOP_Refrigerate_Max = 0;
        }
        if (parse.Refrigerate_After_Opening_Min == '') {
          parse.Refrigerate_After_Opening_Min = 0;
          parse.Refrigerate_After_Opening_Max = 0;
        }
        if (parse.Refrigerate_After_Thawing_Min == '') {
          parse.Refrigerate_After_Thawing_Min = 0;
          parse.Refrigerate_After_Thawing_Max = 0;
        }
        if (parse.Pantry_After_Opening_Min == '') {
          parse.Pantry_After_Opening_Min = 0;
          parse.Pantry_After_Opening_Max = 0;
        }
        console.log(parse);
        db.query({
                  text: "INSERT INTO products(category_id, category, name, subname, pantry_DOP_min, pantry_DOP_max, pantry_DOP_metric, pantry_open_min, pantry_open_max, pantry_open_metric, pantry_tips, fridge_DOP_min, fridge_DOP_max, fridge_DOP_metric, fridge_open_min, fridge_open_max, fridge_open_metric, fridge_after_thawing_min, fridge_after_thawing_max, fridge_after_thawing_metric, fridge_tips, freezer_DOP_min, freezer_DOP_max, freezer_DOP_metric, freezer_tips) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25);",
                  values: [
                            parse.Category_ID, parse['Category_Name [Display ONLY!]'], parse.Name, parse.Name_subtitle,
                            parse.DOP_Pantry_Min, parse.DOP_Pantry_Max, parse.DOP_Pantry_Metric,
                            parse.Pantry_After_Opening_Min, parse.Pantry_After_Opening_Max, parse.Pantry_After_Opening_Metric,
                            parse.Pantry_tips, parse.DOP_Refrigerate_Min, parse.DOP_Refrigerate_Max,
                            parse.DOP_Refrigerate_Metric, parse.Refrigerate_After_Opening_Min, parse.Refrigerate_After_Opening_Max,
                            parse.Refrigerate_After_Opening_Metric, parse.Refrigerate_After_Thawing_Min, parse.Refrigerate_After_Thawing_Max,
                            parse.Refrigerate_After_Thawing_Metric, parse.Refrigerate_tips, parse.DOP_Freeze_Min,
                            parse.DOP_Freeze_Max, parse.DOP_Freeze_Metric, parse.Freeze_Tips
                          ]
                });
      }
    }
  })
}

seed_categories.on('row', function(error) {
  console.log(error);
});
processCSV(product_file, db);

