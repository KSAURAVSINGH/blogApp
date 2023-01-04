const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");
const { pool } = require("./db");
const { pool1} = require("./db");
const { response } = require("express");
const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.send("enter your userid and password");
})

app.post("/register", (req, res) => {
    let email = req.body.email;
    let passcode = req.body.passcode;

    let sql = `INSERT INTO users (userID, passcode) VALUES (?, ?);`;
    pool1.query(sql, [email, passcode], function(err, rows){
        if(err) throw err;
        res.send("Success");
    })
})

app.post("/login", (req, res) => {
    let email = req.body.email;
    let password = req.body.passcode;

    let sql = `SELECT * FROM users where userID = ?;`;
    pool1.query(sql, email, function(err, rows){
        if(err) throw err;
        let len = rows.length;
        if(len == 1 && rows[0].passcode == password){
            console.log("log in");
        }else{
            console.log("wrong");
        }
    })
})

// add new blog
app.post("/blog", function(req, res){
    let title = req.body.title;
    let body = req.body.content;
    //let sql = "select * from blogs";
    let sql = `INSERT INTO blogs (title, body) VALUES (?, ?);`;
    pool.query(sql, [title, body], function(err, rows) {
        if(err) throw err;
        res.send(rows);
    })
})

// update blog
app.put("/blog/:blogID", (req, res) => {
    let title = req.body.title;
    let body = req.body.content;
    if(!title | !body){
        res.send("Field Empty");
    }
    let ID = req.params.blogID;
    let sql = `UPDATE blogs SET ? WHERE id = ID`;
    pool.query(sql,{title: title, body: body}, function(err, rows) {
        if(err) throw err;
        res.send(rows);
    })
})

// delete blog
app.delete("/blog/:blogID", (req, res) => {
    let ID = req.params.blogID;
    var sql = "DELETE FROM blogs WHERE id = ID";
    pool.query(sql, function(err, rows) {
        if(err) throw err;
        res.send(rows);
    })
})

app.listen(3000, function(){
    console.log("Am ready n running");
})