/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const mongoose = require("mongoose");

const MsIdExpress = require("microsoft-identity-express");
const appSettings = require("./appSettings.js");

const mainController = require("./controllers/mainController");

const SERVER_PORT = process.env.PORT || 3000;

// initialize express
const app = express();

/**
 * Using express-session middleware. Be sure to familiarize yourself with available options
 */
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // set this to true on production
    },
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "./public")));

// instantiate the wrapper
const msid = new MsIdExpress.WebAppAuthClientBuilder(appSettings).build();

// initialize the wrapper
app.use(msid.initialize());

// app routes
app.get("/", (req, res) => res.redirect("/home"));
app.get("/home", mainController.getHomePage);

// authentication routes
app.get(
  "/signin",
  msid.signIn({
    postLoginRedirect: "/",
    failureRedirect: "/signin",
  })
);

app.get(
  "/signout",
  msid.signOut({
    postLogoutRedirect: "/",
  })
);

// secure routes
app.get("/id", msid.isAuthenticated(), mainController.getIdPage);
// error
app.get("/unauthorized", (req, res) => res.redirect("/401.html"));

// 404
app.get("*", (req, res) => res.status(404).redirect("/404.html"));

mongoose.connect(process.env.MONGO_URI).then((result) => {
  console.log(`Database connected successfully`);
  app.listen(SERVER_PORT, () =>
    console.log(
      `Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`
    )
  );
})
.catch(err =>{
    console.log(err.message);
})
