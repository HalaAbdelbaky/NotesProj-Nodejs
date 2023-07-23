const express = require("express");
const app = express();
const path = require("path");




// errLog && accessLog//
const morgan = require("morgan");
const fs = require("fs");
const uuid = require("uuid");
app.set("port", process.env.PORT || 3000);







////////////////////////////
const accessLogStream = fs.createWriteStream(
  path.join(__dirname,"..", "logs", "accessLog.log"),
  { flags: "a" }
);
const errorLogStream = fs.createWriteStream(
  path.join(__dirname,"..", "logs", "errorLog.log"),
  { flags: "a" }
);

// //////////////////
const logFormat = (tokens, req, res) => {
   // Define a custom token for the request ID
morgan.token('id', (req) => {
    return req.id;
  });
  
  // Generate a unique ID for each incoming request
  app.use((req, res, next) => {
    req.id = uuid.v4();
    next();
  });
  const date = new Date()
    .toISOString()
    .replace(/[-]/g, "")
    .replace("T", " ")
    .slice(0, -5); // Get the current date and time in the required format
  const id = req.id; // Get the special ID from the request headers
  
//   console.log(id);
//   console.log(new Date().toISOString()
//   .replace(/[-]/g, "") .slice(0, -5));

  const url = ` ${req.protocol}://${req.hostname}:${app.get("port")}`;
  const message = `  ${tokens.id(req)}  ${tokens.method(req, res)}  ${url}  `;
  return `${date} ${res.statusMessage} ${message} `;
};



module.exports={accessLogStream,errorLogStream,logFormat}