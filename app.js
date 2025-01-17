const express = require("express"),
	  app = express(),
	  methodOverride = require("method-override"),
	  expressSanitizer = require("express-sanitizer"),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

mongoose.connect('mongodb://localhost:27017/blog_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type:Date,default:Date.now}
});
var Blog = mongoose.model("Blog",blogSchema);

//RESTful ROUTES
app.get("/",function(req,res){
	res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log("ERR");
		} else{
			res.render("index", {blogs:blogs});
		}
	})
});

//NEW ROUTE
app.get("/blogs/new",function(req,res){
	res.render("new");
})

//CREATE ROUTE
app.post("/blogs",function(req,res){
	//create blogs
	req.body.blog.body = req.sanitize(req.body.blog.body)
	Blog.create(req.body.blog,function(err,newBlog){
		if(err){
			res.render("new");
		}else{
			//then redirect to index
			res.redirect("/blogs");
		}
	})
})

//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		} else{
			res.render("show",{blog:foundBlog});
		}
	})
})

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		} else{
			res.render("edit",{blog:foundBlog});
		}
	})
})

//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
	//edit blogs
	req.body.blog.body = req.sanitize(req.body.blog.body)
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
})

//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
	//destroy blog
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	})
	//redirect somewhere
});

app.listen(3000,function(){
	console.log('Server started on port 3000');
});








