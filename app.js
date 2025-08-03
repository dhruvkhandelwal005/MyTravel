const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listings = require("./models/listing.js");
const path= require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

// to run-> nodemon app.js
// to load data -> cd init >> nodemon index.js
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected  successfully to DB");
})
    .catch((err) => {
        console.log(err);
    })



async function main() {
    await mongoose.connect(MONGO_URL);
}
app.get("/", (req, res) => {
    res.send("hello world");
});
// app.get("/test", async (req, res) => {
//     let sample=new Listing({
//         title:"title",
//         description:"desc",
//         price:1200,
//         location:"goa",
//         country:"india",
//     });
//     await sample.save();
//     console.log("sample was saved");
//     res.send("successfull...");
// });



app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.put(("/listings/:id"),async (req,res)=>{
    let {id}=req.params;
    await Listings.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})


app.get("/listings", async (req,res)=>{
    const allListings= await Listings.find({});
    res.render("listings/index.ejs",{allListings});
});

app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

 
app.post("/listings",async(req,res)=>{
    const newListing= new Listings(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})


app.get("/listings/:id/edit", async(req,res)=>{
    let {id}=req.params;
    const listing= await Listings.findById(id);
    res.render("listings/edit.ejs",{listing});


})
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listings.findById(id);
    res.render("listings/show.ejs",{listing});
});

app.delete("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listings.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})
