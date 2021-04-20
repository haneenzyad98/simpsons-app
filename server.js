'use strict'
// Application Dependencies
const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');
const superagent = require('superagent');
const cors = require('cors');
// Environment variables
require('dotenv').config();
// Application Setup
const PORT = process.env.PORT || 3000;
// Express middleware
const app = express();
// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({ extended: false }))
// Specify a directory for static resources
app.use(express.static('public'))
// define our method-override reference
app.use(methodOverride('_method'))
// Set the view engine for server-side templating
app.set('view engine', 'ejs')
// Use app cors
app.use(cors())
// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);
// -----------------------------------------------------------------

// app routes here
// -- WRITE YOUR ROUTES HERE --
app.get('/',homepage)
app.get('/all' , renderall)
app.post('/all',savedata)
app.get('/save' ,showsave)
app.get('/details/:id',showdetails)
app.put('/details/:id',updatedata)
app.delete('/details/:id',deletedata)
// ---------------------------------------------------------------------
// callback functions
// -- WRITE YOUR CALLBACK FUNCTIONS FOR THE ROUTES HERE --
function homepage(req,res){
    res.render('index')
}
function renderall(req,res){
    let url='https://thesimpsonsquoteapi.glitch.me/quotes?count=10'
    superagent.get(url).set('User-Agent', '1.0').then(x=>{
        let data=x.body;
res.render('all',{z:data})
    })
}
function savedata(req,res){
    let quote=req.body.one;
    let character=req.body.two;
    let src=req.body.three;
    let value=[quote,character,src]
    let SQL=`INSERT INTO exame(quote,character,image)VALUES($1,$$,$3) RETURNING *`
    client.query(SQL,value).then(a=>{
        res.render('index')
    })
}
function showsave(req,res){
    let SQL=`SELECT * FROM exame`
    client.query(SQL).then(c=>{
        res.render('save',{a:c.rows})
    })
}
function showdetails(req,res){
    let SQL=`SELECT * FROM exame WHERE id=$1`
    client.query(SQL,[req.params.id]).then(b=>{
        res.render('details',{g:b.rows[0]})
    })
}
function updatedata(req,res){
    let quote=req.body.quote;
    let character=req.body.image;
    let src=req.body.character;
    let id= req.body.id;
    let value=[quote,character,src,id]
    let SQL=`UPDATE exame SET quote=$1,character=$2,image=$3 WHERE id=$4;`
    client.query(SQL,value).then(q=>{
        res.redirect('details')
    })
}
function deletedata(req,res){
    let id=req.body.id;
    let SQL=`DELETE FROM exame WHERE id=$1;`
    client.query(SQL).then(d=>{
        res.redirect('details')
    })
}
// ---------------------------------------------
// helper functions
// ---------------------------------------------
// app start point
client.connect().then(() =>
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
);
