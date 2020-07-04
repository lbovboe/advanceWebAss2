"use strict";

var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};

// all the html pages
handle["/"] = requestHandlers.reqStart;
handle["/index"] = requestHandlers.reqStart;
// functionality
handle["/ajax"] = requestHandlers.reqAjax;
handle["/ajaxData"] =requestHandlers.reqAjaxData;
handle["/searchInfo"] = requestHandlers.reqSearchInfo;
// Css and image for background
handle["/style"] = requestHandlers.reqStyle;
handle["/bgImg"] = requestHandlers.reqBg;

server.startServer(router.route, handle);
