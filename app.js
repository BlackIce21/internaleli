var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';

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

app.use("/",router);

app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

app.post('/userslogin', function (req, res, next) {
  console.log("to users page");
  res.sendFile(path + "userreg.html");
});

app.listen(3000,function(){
  console.log("Listening at port 3000");
});
