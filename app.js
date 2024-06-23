const express = require("express")
const app = express()
const mongoose = require("mongoose")
const Listing = require("./models/listing")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")))

main().then(console.log("db Success")).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');

 
}
app.listen(8080,()=>{
    console.log("Started")
})
app.get("/",(req,res)=>{
    res.send('Hoi')
})
app.get("/listings", async (req,res)=>{
   const allListings= await Listing.find({})
   res.render("listings/index.ejs",{allListings})
})
app.get("/listings/new", async (req,res)=>{
  res.render("listings/new.ejs")
  })

  


app.get("/listings/:id",async (req,res)=>{
  let {id} = req.params;
 
  const listing = await Listing.findById(id);

  res.render("listings/show.ejs",{listing})
})
//create
app.post("/listings", async (req,res)=>{
    const newListing = new Listing(req.body.listing);
 await newListing.save()
   res.redirect("/listings")
    
})
//update
app.get("/listings/:id/edit",async (req,res)=>{
  let {id} = req.params;  
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs",{listing})
})
//
app.put("/listings/:id",async (req,res)=>{
  let {id} = req.params
 await Listing.findByIdAndUpdate(id,{...req.body.listing})
  res.redirect(`/listings/${id}`)
})
//delete
app.delete("/listings/:id",async (req,res)=>{
  let {id} = req.params;  
   await Listing.findByIdAndDelete(id);
   res.redirect("/listings")
 
})