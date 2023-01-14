const express=require("express");
const bodyParser= require("body-parser");
const app=express();
const mongoose=require("mongoose");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://admin-charu:Test123@cluster1.omgf6xj.mongodb.net/todolistDB");

const itemsSchema={
  name:String
};
const Item=mongoose.model("Item",itemsSchema);
const task1=new Item({
  name:"Brush your teeth"
});
const task2=new Item({
  name:"Eat Breakfast"
});
const task3=new Item({
  name:"Start coding!"
});
const defaultItems=[task1,task2,task3];

const PORT=3000;

app.get("/about",function(req,res){
  res.render("about");
})



app.get("/",function(req,res){
  Item.find({},function(err,foundItems){
    if(foundItems.length===0){
      Item.insertMany(defaultItems,function(err){
        if(err){
            console.log("Ahhh ERROR!");
        }
        else{
          console.log("Yayy No Error!");
        }

      });
      res.redirect("/");
    }
    res.render("list",{listTitle:"Today",NewItem:foundItems});
  });

});


app.post("/delete",function(req,res){
const checkedItemId=req.body.check;
Item.findByIdAndRemove(checkedItemId,function(err){
  if(err){
    console.log(err);
  }
  else{
    console.log("Item deleted succesfully!");
  }
});
res.redirect("/");
})

app.post("/",function(req,res){
  console.log(req.body);
const itemName=req.body.newItem;
const newItem=Item({
  name:itemName
});

newItem.save();
res.redirect("/");
});
app.get("/work",function(req,res){
  res.render("list",{listTitle:"Work List",NewItem:workItems});
});

app.listen(PORT,function(){
  console.log("Server started on port "+PORT);
});
