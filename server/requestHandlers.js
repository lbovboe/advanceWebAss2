"use strict";

var querystring = require("querystring");
var fs = require("fs");
var requestMod = require("request");
var ObjTree = require("xml-objtree");
var objTree = new ObjTree();

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

function reqSearchInfo(request, response) {
  console.log("request searchInfo was called");
  var data = "";
  request.on("data", function (chunk) {
    data += chunk;
    console.log("inside" + data);
  });
  request.on("end", function () {
    // make into js object from JSON
    var dataObj = JSON.parse(data);
    // get year from the data
    var year = dataObj.year;
    var sMonth = parseInt(dataObj.sMonth);
    var eMonth = parseInt(dataObj.eMonth);
    if(parseInt(year) >= 2006 && parseInt(year) <= 2009){
      requestMod.get(
        `http://it.murdoch.edu.au/~S900432D/ict375/data/${year}.xml`,
        function (error, response2, body) {
          if (!error && response2.statusCode == 200) {
            // Continue with your processing here.
            console.log("Getting data from xml external file");
            var jsonObject = objTree.parseXML(body);
            var finalObj1 = getMonthsDataXML(sMonth, eMonth, jsonObject);
            var dataBack1 = JSON.stringify(finalObj1);
            response.end(dataBack1);
          } else {
            console.log("error");
          }
        }
      );
    }else{
      requestMod.get(
        `http://it.murdoch.edu.au/~S900432D/ict375/data/${year}.json`,
        function (error, response2, body) {
          if (!error && response2.statusCode == 200) {
            // Continue with your processing here.
            console.log("Getting data from json file");
            var jsonData = body;
            console.log(typeof jsonData);
            var jsObj = JSON.parse(jsonData);
            var finalObj = getMonthsData(sMonth, eMonth, jsObj);
            var dataBack = JSON.stringify(finalObj);
            response.end(dataBack);
          } else {
            console.log("error");
          }
        }
      );
    }
    
  });
}
var getMonthsData = function (startMonth, endMonth, obj) {
  var count = 0;
  var totalSr = 0;
  var totalWs = 0;
  var avg = 0;
  var avgWsKm =0;
  var avg2dp = 0;
  var srKwh = 0;
  var arrSr = [];
  var arrWs = [];
  var length = obj.weather.record.length;
  for (var k = startMonth; k < endMonth + 1; k++) {
    count = 0;
    totalSr = 0;
    totalWs = 0;

    for (var i = 0; i < length; i++) {
      var data = parseInt(obj.weather.record[i].date.substring(3, 5));
      var sr = parseInt(obj.weather.record[i].sr);
      if (data == k) {
        count++;
        
        totalWs += obj.weather.record[i].ws;
        if(sr>=100){
          totalSr += sr;
        }
      }
    }
    avg = totalWs / count;
    avgWsKm = (avg*3600)/1000;
    avg2dp = avgWsKm.toFixed(2);
    srKwh = (totalSr/6000).toFixed(2);
    arrSr.push(srKwh);
    arrWs.push(avg2dp);
  }
  var resultObj = {
    ws: arrWs,
    sr: arrSr,
  };
  return resultObj;
};

var getMonthsDataXML = function (startMonth, endMonth, obj) {
  var count = 0;
  var totalSr = 0;
  var totalWs = 0;
  var avg = 0;
  var avg2dp = 0;
  var avgWsKm =0;
  var srKwh = 0;
  var arrSr = [];
  var arrWs = [];
  var length = obj.weather.record.length;
  for (var k = startMonth; k < endMonth + 1; k++) {
    count = 0;
    totalSr = 0;
    totalWs = 0;

    for (var i = 0; i < length; i++) {
      var data = parseInt(obj.weather.record[i].date.substring(3, 5));
      var sr = parseInt(obj.weather.record[i].sr);
      if (data == k) {
        count++;
        totalWs += parseInt(obj.weather.record[i].ws);
        if(sr>=100){
          totalSr += sr;
        }
      }
    }
    avg = totalWs / count;
    avgWsKm = (avg*3600)/1000;
    avg2dp = avgWsKm.toFixed(2);
    srKwh = (totalSr/6000).toFixed(2);
    arrSr.push(srKwh);
    arrWs.push(avg2dp);
  }
  var resultObj = {
    ws: arrWs,
    sr: arrSr,
  };
  return resultObj;
};
exports.reqStart = reqStart;
exports.reqStyle = reqStyle;
exports.reqBg = reqBg;
exports.reqAjax = reqAjax;
exports.reqSearchInfo = reqSearchInfo;
