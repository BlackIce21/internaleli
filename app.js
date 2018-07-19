var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var Connection = require('tedious').Connection;

// Create connection to database
var config =
   {
     userName: 'ctadmin', // update me
     password: 'ctAdit0721', // update me
     server: 'eliwebapp.database.windows.net', // update me
     options:
        {
           database: 'eliwebapp' //update me
           , encrypt: true
        }
   }
var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err)
   {
     if (err)
       {
          console.log(err);
       }
    else
       {
          console.log("conncted");
       }
   }
 );

    function executeStatement1() {
        request = new Request("INSERT INTO dbo.users (Name, Email) values (@Name, @Email)", function(err) {
         if (err) {
            console.log(err);}
        });
        request.addParameter('Name', TYPES.NVarChar, 'Aditya');
        request.addParameter('Email', TYPES.NVarChar , 'aditya@cloudthat.in');
        request.addParameter('Cost', TYPES.Int, 11);
        request.addParameter('Price', TYPES.Int,11);
        request.on('row', function(columns) {
            columns.forEach(function(column) {
              if (column.value === null) {
                console.log('NULL');
              } else {
                console.log("inserted");
              }
            });
        });
        connection.execSql(request);
    }

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  res.sendFile(path + "selectuser.html");
});

router.get("/userslogin",function(req,res){
  res.sendFile(path + "userreg.html");
});

router.get("/adminlogin",function(req,res){
  res.sendFile(path + "adminpage.html");
});

router.get("/register", function(req, res){
  res.sendFile(path + "register.html");
});

app.use("/",router);

app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

app.post('/register', function (req, res) {
    console.log(req.body);
    const email = req.body.email;
    const name = req.body.name;

    const data = {
        email,
        name
    };
    console.log("Posted " + data);
    res.sendFile(path + "register.html");
});

app.listen(3000,function(){
  console.log("Listening at port 3000");
});
