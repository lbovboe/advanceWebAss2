"use strict";

var querystring = require("querystring");
var fs = require("fs");
var requestMod = require("request");

function reqStart(request, response) {
  console.log("Request handler 'start' was called.");
  response.writeHead(200, { "Content-Type": "text/html" });
  fs.createReadStream("../client/index.html", "utf-8").pipe(response);
}

function reqStyle(request, response) {
  console.log("Request handler 'style' was called.");
  response.writeHead(200, { "Content-Type": "text/css" });
  fs.createReadStream("../client/style.css").pipe(response);
}
function reqBg(request, response) {
  console.log("Request handler 'bgImg' was called.");
  response.writeHead(200, { "Content-Type": "image/png" });
  fs.createReadStream("../client/bgImg.png").pipe(response);
}
function reqAjax(request, response) {
  console.log("request handler 'ajax' was called");
  response.writeHead(200, { "Content-Type": "text/js" });
  fs.createReadStream("../client/ajax.js").pipe(response);
}
function reqAjaxData(request, response) {
  console.log("request handler 'ajaxData' was called");
  var jsonData2010 = "";
  var data = "";
  request.on("data", function (chunk) {
    data += chunk;
  });
  console.log(data);
  requestMod.get(
    "http://it.murdoch.edu.au/~S900432D/ict375/data/2010.json",
    function (error, response2, body) {
      if (!error && response2.statusCode == 200) {
        // Continue with your processing here.
        jsonData2010 = body;
        console.log(typeof jsonData2010);
        //var json = JSON.parse(jsonData2010);

        response.end(jsonData2010);
      } else {
        console.log("error");
      }
    }
  );
}
function reqSearchInfo(request, response) {
  console.log("request searchInfo was called");
  var data = "";
  request.on("data", function (chunk) {
    data += chunk;
    console.log("inside" + data);
  });
  request.on("end", function () {
    
    console.log("suc "+data);
    var dataObj = JSON.parse(data);
    console.log(dataObj.year);
    response.end("successful");
  });
}

exports.reqStart = reqStart;
exports.reqStyle = reqStyle;
exports.reqBg = reqBg;
exports.reqAjax = reqAjax;
exports.reqAjaxData = reqAjaxData;
exports.reqSearchInfo = reqSearchInfo;
