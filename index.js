const express = require("express");
const path = require("path");
const {nanoid} = require('nanoid');
const mongoose = require("mongoose");
const {url} = require("./model/urls")
require("dotenv").config();


mongoose.connect(process.env.connectUrl)
.then(() => console.log("✅ MongoDB connection established"))
.catch(err => console.error("❌ MongoDB connection failed", err));



const app = express();
const PORT = process.env.PORT || 3000;



app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.set("view engine", "ejs");
app .set("views", path.join(__dirname, "views"));



app.get("/", (req, res) => {

  let {shortCode} = req.query
  let displayUrl = null

  if(shortCode){
    displayUrl = `${process.env.link}/${shortCode}`
  }

  res.render("index",{shortCode,displayUrl});  
});


app.post("/shorten",async (req,res)=>{
  try{
    const {originalUrl} = req.body
    const shortCode = nanoid(5)
  
    const newData = new url({originalUrl,shortCode})
    await newData.save()
    
    res.redirect(`/?shortCode=${shortCode}`)
  }
  catch(err){
    console.error("❌ Failed to save:", err);
    res.redirect("/")
  }
  
})



app.get("/:shortCode",async (req,res)=>{
  try{
    const {shortCode} = req.params
    const Data = await url.findOne({shortCode})
    res.redirect(Data.originalUrl)
  }
  catch(err){res.redirect("/")}
})





app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
