var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';
var azure = require('azure-storage');
var multer = require('multer');
var formidable = require('formidable');
var multerAzure = require('multer-azure');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json());

//File upload multer

var upload = multer({
  storage: multerAzure({
    connectionString: 'DefaultEndpointsProtocol=https;AccountName=internaleliapp;AccountKey=VLy1Oj9hFNCpIP6U36LI7OKFEFCad5v5bBJeEETpowCLO4x1jj/lhxEUXkWy72951GlkSIHwUJVyNtSWVhw8sQ==;EndpointSuffix=core.windows.net', //Connection String for azure storage account, this one is prefered if you specified, fallback to account and key if not.
    account: '', //The name of the Azure storage account
    key: '', //A key listed under Access keys in the storage account pane
    container: 'resblob'  //Any container name, it will be created if it doesn't exist
  })
});

// Azure DB
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var Connection = require('tedious').Connection;

// Create connection to database
var config = {
  userName: 'ctadmin', // update me
  password: 'ctAdit0721', // update me
  server: 'eliwebapp21.database.windows.net', // update me
  options: {
    database: 'internaleliapp',
    encrypt: true
  }
}
var connection = new Connection(config);

// AConnect to DB
function connecttoDB(){
connection.on('connect', function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to DB");
  }
});
}
// Inserting into DB
function connectAndInsert(data) {
  connecttoDB();
  request = new Request("INSERT INTO dbo.ctusers (Name, Email, Job_title, Exp_year, Exp_month, Certs, College, Hometown, Manager, Int_proj, Ext_proj, Skills, Resume_url) values (@Name, @Email, @Job_title, @Exp_year, @Exp_month, @Certs, @College, @Hometown, @Manager, @Int_proj, @Ext_proj, @Skills, @Resume_url)", function(err) {
    if (err) {
      console.log("Could not insert");
    }else{
      console.log("Inserted row");
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
  request.addParameter('Resume_url', TYPES.NVarChar, data.fileup);
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
  res.sendFile(path + "index4.html");
});

router.get("/register", function(req, res) {
  res.sendFile(path + "register.html");
});

app.use("/", router);

app.post('/register', upload.single('customFile'), function(req, res) {
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
  const skills = req.body.skills;
  const fileup = req.file.url;
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
    expm,
    skills,
    fileup
  };
  connectAndInsert(data);
  res.sendFile(path + "register.html");
});

app.use("*", function(req, res) {
  res.sendFile(path + "404.html");
});

app.listen(3000, function() {
  console.log("Listening at port 3000");
});
