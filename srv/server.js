/*eslint no-console: 0, no-unused-vars: 0, no-undef:0*/
/*eslint-env node, es6 */

"use strict";
var https = require("https");
var port = process.env.PORT || 3000;
var xsenv = require("@sap/xsenv");
var server = require("http").createServer();

var cds = require("@sap/cds");

var passport = require("passport");
var xssec = require("@sap/xssec");
var xsHDBConn = require("@sap/hdbext");
var express = require("express");

https.globalAgent.options.ca = xsenv.loadCertificates();

global.__base = __dirname + "/";
//global.__uaa = process.env.UAA_SERVICE_NAME;

//logging
var logging = require("@sap/logging");
var appContext = logging.createAppContext();

//Initialize Express App for XS UAA and HDBEXT Middleware
var app = express();

passport.use("JWT", new xssec.JWTStrategy(xsenv.getServices({
	uaa: {
		tag: "xsuaa"
	}
}).uaa));
app.use(logging.middleware({
	appContext: appContext,
	logNetwork: true
}));
app.use(passport.initialize());

var hanaOptions = xsenv.filterCFServices({
	plan: "hdi-shared"
})[0].credentials;

hanaOptions = {
	"hana": hanaOptions
};
hanaOptions.hana.pooling = true;

//hanaOptions.hana.rowsWithMetadata = true;
app.use(
	passport.authenticate("JWT", {
		session: false
	}),
	xsHDBConn.middleware(hanaOptions.hana)
);

//CDS OData V4 Handler
var options = {
	driver: "hana"
};
Object.assign(options, hanaOptions.hana, {
	driver: options.driver
});

cds.connect(options);

// TO-do : modofy
var odataURL = "/odata/v4/opensap.hana.CatalogService/";

// Main app
cds.serve("gen/srv/csn.json", {
		crashOnError: false
	})
	.at(odataURL)
	.with(require("./lib/handlers"))
	.in(app)
	.catch((err) => {
		console.log(err);
		//process.exit(1);
	});

// Redirect any to service root
app.get("/", (req, res) => {
	res.redirect(odataURL);
});

//Start the Server 
server.on("request", app);
server.listen(port, function () {
	console.info(`HTTP Server: ${server.address().port}`);
});