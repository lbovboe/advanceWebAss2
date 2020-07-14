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
    // make into js object from JSON
    var dataObj = JSON.parse(data);
    // get year from the data
    var year = dataObj.year;
    var sMonth = parseInt(dataObj.sMonth);
    var eMonth = parseInt(dataObj.eMonth);

    requestMod.get(
      `http://it.murdoch.edu.au/~S900432D/ict375/data/${year}.json`,
      function (error, response2, body) {
        if (!error && response2.statusCode == 200) {
          // Continue with your processing here.
          console.log(year);
          console.log(sMonth);
          console.log(eMonth);
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
  });
}
var getMonthsData = function (startMonth, endMonth, obj) {
  var count = 0;
  var totalSr = 0;
  var totalWs = 0;
  var avg = 0;
  var avg2dp = 0;
  var arrSr = [];
  var arrWs = [];
  var length = obj.weather.record.length;
  for (var k = startMonth; k < endMonth + 1; k++) {
    count = 0;
    totalSr = 0;
    totalWs = 0;

    for (var i = 0; i < length; i++) {
      var data = parseInt(obj.weather.record[i].date.substring(3, 5));
      if (data == k) {
        count++;
        totalSr += obj.weather.record[i].sr;
        totalWs += obj.weather.record[i].ws;
      }
    }
    avg = totalWs / count;
    avg2dp = avg.toFixed(2);
    arrSr.push(totalSr);
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
exports.reqAjaxData = reqAjaxData;
exports.reqSearchInfo = reqSearchInfo;
