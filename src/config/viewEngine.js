import express from "express";
const path = require('path');

let configViewEngine = (app) => {
    app.use(express.static("./src/public"));
    //app.use('/static', express.static(path.join(__dirname, 'public')));
    app.use('/static', express.static(path.join(__dirname, 'src', 'public')));

    app.set("view engine", "ejs");
    app.set("views", "./src/views");  
    app.set("redirect", "./src/views")
}

module.exports = configViewEngine;