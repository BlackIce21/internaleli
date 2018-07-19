var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json());

var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var Connection = require('tedious').Connection;

// Create connection to database
var config = {
  userName: 'ctadmin', // update me
  password: 'ctAdit0721', // update me
  server: 'eliwebapp.database.windows.net', // update me
  options: {
    database: 'eliwebapp' //update me
      ,
    encrypt: true
  }
}
var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("conncted");
  }
});
// Inserting into DB
function insertrow(data) {
  request = new Request("INSERT INTO dbo.ctusers (Name, Email, Job_title, Exp_year, Exp_month, Certs, College, Hometown, Manager, Int_proj, Ext_proj, Skills) values (@Name, @Email, @Job_title, @Exp_year, @Exp_month, @Certs, @College, @Hometown, @Manager, @Int_proj, @Ext_proj, @Skills)", function(err) {
    if (err) {
      console.log(err);
    }
  });
  request.addParameter('Name', TYPES.NVarChar, data.name);
  request.addParameter('Email', TYPES.NVarChar, data.email);
  request.addParameter('Job_title', TYPES.NVarChar, data.title);
  request.addParameter('Certs', TYPES.NVarChar, data.certs);
  request.addParameter('College', TYPES.NVarChar, data.coll);
  request.addParameter('Hometown', TYPES.NVarChar, data.home);
  request.addParameter('Manager', TYPES.NVarChar, data.mgr);
  request.addParameter('Int_proj', TYPES.NVarChar, data.intproj);
  request.addParameter('Ext_proj', TYPES.NVarChar, data.extproj);
  request.addParameter('Skills', TYPES.NVarChar, data.skills);
  request.addParameter('Exp_year', TYPES.Int, data.expy);
  request.addParameter('Exp_month', TYPES.Int, data.expm);
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

router.use(function(req, res, next) {
  console.log("/" + req.method);
  next();
});

router.get("/", function(req, res) {
  res.sendFile(path + "selectuser.html");
});

router.get("/userslogin", function(req, res) {
  res.sendFile(path + "userreg.html");
});

router.get("/adminlogin", function(req, res) {
  res.sendFile(path + "adminpage.html");
});

router.get("/register", function(req, res) {
  res.sendFile(path + "register.html");
});

app.use("/", router);

app.post('/register', function(req, res) {
  const email = req.body.email;
  const name = req.body.name;
  const title = req.body.title;
  const certs = req.body.certs;
  const coll = req.body.college;
  const home = req.body.home;
  const mgr = req.body.manager;
  const intproj = req.body.intproj;
  const extproj = req.body.extproj;
  const expy = req.body.expy;
  const expm = req.body.expm;
  const data = {
    email,
    name,
    title,
    certs,
    coll,
    home,
    mgr,
    intproj,
    extproj,
    expy,
    expm
  };
  insertrow(data);
  res.sendFile(path + "register.html");
});

app.use("*", function(req, res) {
  res.sendFile(path + "404.html");
});


app.listen(3000, function() {
  console.log("Listening at port 3000");
});
