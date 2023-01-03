const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");
const { pool } = require("./db");
const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.send("enter your userid and password");
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