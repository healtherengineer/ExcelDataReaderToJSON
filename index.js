//Modülleri ekledim
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
  database: 'inavitas_device',
  password: '12345',
  port: 5432
})
client.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


const query = `
Select * from device_point ';
`;

client.query(query, (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Data is pulled from inavitas_device');
    console.log(res);
    client.end();
});

//adssa
//npm i xlsx

app.use('/publicfiles', express.static(__dirname + '/publicfiles'));
app.use(express.static(__dirname + '/public'));
app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 100000 }));


//anlamadım burayı
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

//http://localhost:3000/readexcelfile?filename=financial
app.get("/readexcelfile", (req, res) => {

    let fileName = req.query.filename;
    let data = [];
    try {
        const file = reader.readFile('publicfiles/' + fileName + ".xlsx",{sheetStubs: true});
        const sheetNames = file.SheetNames;

        //Sayfa sayısı kadar dönecek
        //-1 dedik kaç tane boş sayfa varsa diye bir algoritma yazıp çıkarırız baştan
        for (let i = 0; i < sheetNames.length; i++) {
            const arr = reader.utils.sheet_to_json(file.Sheets[sheetNames[i]])
            for(let k = 0 ; k < arr.length ; k++){
                data.push(arr[k]);
            }
            /*arr.forEach((res) => {

                data.push(res)

            })*/
        }
        let data2array=[];

        data.forEach((x)=>{
            if(Object.keys(x).includes("Tarih")){
                data2array.push(x)

            }
        });
        console.log(data2array)
        res.send(data2array);
        res.send(data);

    } catch (err) {
        res.send(err);

    }
})

app.listen(3000, function () {
    console.log("node app is running on port 3000!");
})
