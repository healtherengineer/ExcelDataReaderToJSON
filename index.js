//Moduls added
const express = require("express");

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const reader = require('xlsx');
//DB Connection module

const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'sample_database',
  password: '*****',
  port: 5432
})
client.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

//You can write you queries now.

app.use('/publicfiles', express.static(__dirname + '/publicfiles'));
app.use(express.static(__dirname + '/public'));
app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 100000 }));



app.post("/upload", (req, res) => {


    let bsae64 = req.body.base64;

    let fileExtension = req.body.ext;

    let filename = Date.now().toString + fileExtension;

    if (base64) {
        let arr = base64.split(',');
        fs.writeFile("publicfiles/" + filename, arr[1], 'base64', function (err) {
            if (err) {
                res.send(err);
            } else {
                console.log("uploaded!");
                res.send("http://localhost:3000/publicfiles/" + filename);

            }
        })
    }

})

//http://localhost:3000/readexcelfile?filename=Financial

app.get("/readexcelfile", (req, res) => {

    let fileName = req.query.filename;
    let data = [];
    try {
        const file = reader.readFile('publicfiles/' + fileName + ".xlsx",{sheetStubs: true},{
            type: 'binary',
            cellDates: true,
            cellNF: false,
            cellText: false
          });
        const sheetNames = file.SheetNames;

        //Sayfa sayısı kadar dönecek
        //-1 dedik kaç tane boş sayfa varsa diye bir algoritma yazıp çıkarırız baştan
        for (let i = 0; i < sheetNames.length; i++) {
            const arr = reader.utils.sheet_to_json(file.Sheets[sheetNames[i]],{
                raw: false,
               })
          //  for(let k = 0 ; k < arr.length ; k++){
            //    data.push(arr[k]);
            //}
            arr.forEach((res) => {

                data.push(res)

            })
        }
        

      res.send(data)

    } catch (err) {
        res.send(err);

    }
})


app.listen(3000, function () {
    console.log("node app is running on port 3000!");
})
