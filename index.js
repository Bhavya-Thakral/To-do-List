import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db= new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "todo",
    password:"bhavya",
    port: 5432
});

db.connect();

const app=express();
const port=3000;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));
let newListItems=[];

app.get("/", async(req,res)=>{
    try{
        const today=new Date();
        const day=today.toLocaleDateString();
        const result=await db.query("select * from items order by id asc");
        newListItems= result.rows;


        res.render("index.ejs",{date:day, newItem:newListItems});

    }
    catch(err){
        console.log(err);
    }
    
});

app.post("/",async(req,res)=>{
    const newItems= req.body.newitems;
    // newListItems.push(newItems);
    try{
        await db.query("insert into items (title) values ($1)",[newItems]);
        res.redirect("/");

    } catch(err){
        console.log(err);
    }
});

app.post("/edit",async(req,res)=>{
    const upItem=req.body.updateItemTitle;
    const id= req.body.updateItemId;

    try{
        await db.query("update items set title=($1) where id=$2",[upItem,id]);
        res.redirect("/");
    }
    catch(err){
        console.log(err);
    }

});

app.post("/delete",async(req,res)=>{
    const id= req.body.deleteItemId;
    try{
        await db.query("delete from items where id=$1",[id]);
        res.redirect("/");
    } catch(err){
        console.log(err);
    }
});

app.listen(port,()=>{
    console.log(`server working on ${port}.`);
});