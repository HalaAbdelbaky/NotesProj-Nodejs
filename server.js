const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
app.use(cookieParser());
const morgan = require("morgan");
const userRoutes=require('./routes/userRoutes')
const {accessLogStream,errorLogStream,logFormat}=require("./middleware/access_error")
console.log(userRoutes)



// cors
const corsOptions = require("./config/corsOptions");
app.use(cors(corsOptions));


// configConnection
const dbConnec = require("./config/dbConnec");
dbConnec();



// ///logging///////////////////
app.use(
  morgan(logFormat, {
    stream: accessLogStream,
    skip: (req, res) => res.statusCode == 404,
  })
);
app.use(
  morgan(logFormat, {
    stream: errorLogStream,
    skip: (req, res) => res.statusCode != 404 ,
  })
);




// hbs
const hbs = require('hbs');
app.set('view engine', 'hbs');
app.set('views',path.join(__dirname,"views"));

// CRUD Operations
// app.use(noteRouter)
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// routes
app.use(express.static(path.join(__dirname,"public")))
app.use( userRoutes)

// app.use(userRoutes.userProfile)
app.use(require('./routes/auth.routes'))
app.use( require('./routes/noteRoutes'))

app.use("/userProfile/notes/new",(req,res)=>res.render("newNote"))
app.use("/userProfile/user/new",(req,res)=>res.render("newUser"))
app.use("/login",(req,res)=>res.sendFile(path.join(__dirname, "assets", "loginPage.html")))
app.get("/", (req, res) =>  res.sendFile(path.join(__dirname, "assets", "index.html")))

app.get('/userProfileAdmin',(req, res) => res.render("userProfileAdmin"))
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "assets", "error.html"));
  } else if (req.accepts("json")) {
    res.send({ message: "404 page not found" });
  } else {
    res.type("text").send("404 page not found");
  }
});




// port
app.set("port", process.env.PORT ||5000);

// connection success
mongoose.connection.once("open", () => {
  console.log("connection is succeeded");
  app.listen(app.get("port"), () => {
    console.log("the server is in the port " + app.get("port"));
  });
});


