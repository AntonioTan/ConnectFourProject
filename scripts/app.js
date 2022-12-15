const express = require("express");
const web3 = require("web3");
const ethjs = require("ethjs");
const app = express();

app.use(express.static("./"));
app.get("/",function(req,res){
	res.sendFile(__dirname+"../index.html");
 	res.sendFile(__dirname+"/web3.min.js")
 	res.sendFile(__dirname+"/main.js")
	res.sendFile(__dirname+"/abi.js")
	res.sendFile(__dirname+"/ethjs.js")
});
app.listen(8080,function(){console.log("listening on port 8080");});