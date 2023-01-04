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
// register as user
app.post("/register", (req, res) => {
    let email = req.body.email;
    let passcode = req.body.passcode;
    let sql = `SELECT * FROM users where userID = ?;`;
    pool1.query(sql, email, function(err, rows){
        if(err) throw err;
        let len = rows.length;
        if(len == 0){
            sql = `INSERT INTO users (userID, passcode) VALUES (?, ?);`;
            pool1.query(sql, [email, passcode], function(err, rows){
                if(err) throw err;
                res.send("Success");
            })
        }else{
            res.send("User exists");
        }
    })
})
// login as user
app.post("/login", (req, res) => {
    let email = req.body.email;
    let password = req.body.passcode;
    if(!email | !password){
        res.send("Field Empty");
    }
    let sql = `SELECT * FROM users where userID = ?;`;
    pool1.query(sql, email, function(err, rows){
        let userID = rows[0].id;
        if(err) throw err;
        let len = rows.length;
        if(len == 1 && rows[0].passcode == password){
            sql = `SELECT * FROM blogs where userID = ?;`;
            pool1.query(sql, userID, function(err, rows){
                if(err) throw err;
                res.send(rows);
            })
        }else{
            console.log("wrong");
        }
    })
})

// add new blog
app.post("/blog/:userID", function(req, res){
    let title = req.body.title;
    let body = req.body.content;
    if(!title | !body){
        res.send("Field Empty");
    }
    let userID = req.params.userID;
    let sql = `INSERT INTO blogs (title, body, userid) VALUES (?, ?, ?);`;
    pool.query(sql, [title, body, userID], function(err, rows) {
        if(err) throw err;
        res.send(rows);
    })
})

// update blog
app.put("/blog/:userID/:blogID", (req, res) => {
    let title = req.body.title;
    let body = req.body.content;
    let ID = req.params.blogID;
    let userID = req.params.userID;
    if(!title | !body){
        res.send("Field Empty");
    }
    let sql = `SELECT userid from blogs where id = ID`;
    pool.query(sql, function(err, rows){
        if(err) throw err;
        if(userID == rows[0].userid){
            sql = `UPDATE blogs SET ? WHERE id = ID and userid = userID`;
            pool.query(sql,{title: title, body: body}, function(err, rows) {
                if(err) throw err;
                res.send(rows);
            })
        }else{
            res.send("Not your blog");
        }
    })
})

// delete blog
app.delete("/blog/:userID/:blogID", (req, res) => {
    let ID = req.params.blogID;
    let userID = req.params.userID;
    let sql = `SELECT userid from blogs where id = ID`;

    pool.query(sql, function(err, rows){
        if(err) throw err;
        if(userID == rows[0].userid){
            sql = "DELETE FROM blogs WHERE id = ID";
            pool.query(sql, function(err, rows) {
                if(err) throw err;
                res.send("Successfully deleted");
            })
        }else{
            res.send("Not your blog");
        }
    })
})

app.listen(3000, function(){
    console.log("Am ready n running");
})


// create table vs code se hoga
// authentication achha krma
// update ko update kro