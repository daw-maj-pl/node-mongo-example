const express = require('express');
// const bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
const connetionString = `mongodb+srv://wsbdaw:123456qwerty@cluster0.3s0it.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

MongoClient.connect(connetionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('połączono z bazą danych');
    const db = client.db('nowabazadanych');
    const nazwaKolekcji = db.collection('nazwakolekcji');
    app.get('/', function (req, res) {
      //   res.sendFile(__dirname + '/index.html');
      const cursor = db
        .collection('nazwakolekcji')
        .find()
        .toArray()
        .then(result => {
          console.log(result);
          res.render('index.ejs', {
            daneDoWyswietlenia: result
          });
        })
        .catch(error => console.error(error));
      console.log(cursor);
      // res.send("Jakiś tekst")
    });

    app.post('/someuserdata', (req, res) => {
      console.log('coś zostało wysłane');
      console.log(req.body);
      nazwaKolekcji
        .insertOne(req.body)
        .then(result => console.log(result))
        .catch(error => console.log(error));
    });

    app.listen(port, err => {
      if (err) {
        return console.error(`Błąd: ${err}`);
      }
      console.log(`Aplikacja działa na porcie ${port}`);
    });
  })
  .catch(error => console.log('błąd połączenia'));
