const PORT = process.env.PORT || 8080; 
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var fs = require("fs");
const { response } = require("express");

//Tyylitiedostoja ja navi baarin määritys, jonka saa joka sivulle
var nav='<div class="horisontti1"><ul><li><a href="http://localhost:8080/"> Etusivu </a></li><li><a href="http://localhost:8080/guestbook"> Vieraskirjan viestit </a></li><li><a href="http://localhost:8080/newmessage"> Vieraskirja </a></li><li><a href="http://localhost:8080/ajaxmessage"> Ajax viestit </a></li></ul> </div>'
var styleData= '<style>.horisontti1 ul {list-style-type: none;margin: 0;padding: 0;overflow: hidden;background-color: AQUA;}.horisontti1 li {float: left;}.horisontti1 li a {display: block;color: black;text-align: center;padding: 14px 16px;text-decoration: none;}.horisontti1 li a:hover:not(.avoin){background-color: RGB(0, 100, 120);}.horisontti1 .avoin {background-color: rgb(230, 0, 115);} .th{background-color: Aquamarine;}</style>'

//jsonin käyttöön ottoa ja parseria avuksi
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Määritellään juuri reitti
app.use(express.static('./Public'));

app.get("/", function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get("/guestbook", function(req, res) {
    var data = require('./guestbook.json');
    
    var results = '<table border="4" width="550">'
    
    for (var i = 0; i < data.length; i++) {
        results +=
        '<tr>' +
        '<th class="th">' + 'ID' + '</th>' +
        '<th class="th">' + 'Username' + '</th>' +
        '<th class="th">' + 'Country' + '</th>' +
        '<th class="th">' + 'Message' + '</th>' +
        '</tr>' +
        '<tr>' +
        '<td>' + data[i].id + '</td>' +  
        '<td>' + data[i].username + '</td>' +
        '<td>' + data[i].country + '</td>' + 
         '<td>' + data[i].message + '</td>' + '</tr>';
         }
         results+=
         '</table>';
         
    res.send(nav + styleData + results);
});



app.get("/newmessage", function(req, res) {
   res.sendFile(__dirname + "/newmessage.html");
});


app.post("/newmessage", function(req, res) {
    
var data= require('./guestbook.json');
  
data.push({
    id: data.length + 1,
    username: req.body.username,
    country: req.body.country,
    message: req.body.message
});

var jsonStr = JSON.stringify(data);
fs.writeFile("./guestbook.json",jsonStr, (err)=>{
    if(err) throw err;
});
res.send(nav + styleData + "Kiitos kun jätit viestin!");

});


app.get("/ajaxmessage", function(req, res) {
    res.sendFile(__dirname + "/ajax.html");
});

//samalla logiikalla kuin vieraskirjan viestit, käyttävät samaa json tiedostoa
app.post("/ajaxmessage", function(req, res) {
    var data= require('./guestbook.json');

    data.push({
        id: data.length + 1,
        username: req.body.username,
        country: req.body.country,
        message: req.body.message
    });
    
    var jsonStr = JSON.stringify(data);
    fs.writeFile("./guestbook.json",jsonStr, (err)=>{
        if(err) throw err;
    });
  
  
   
        res.send(nav + styleData + "Lähetit ajax viestin: " + req.body.message + ". viesti näkyy nyt vieraskirjassa");
    


});


  app.listen(8080, function() {
      //väliviesti työstö vaiheeseen
    console.log("toimii");
});