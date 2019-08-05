var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require('../middleware');
var request = require("request");



// // --- this was an object with campgrounds
// var campgrounds = [
//     {
//         name: "Creek", 
//         image: "https://media.gettyimages.com/photos/camping-tent-in-a-camping-in-a-forest-by-the-river-picture-id911995140?b=1&k=6&m=911995140&s=612x612&w=0&h=Ct_pGVJSGD_9hF8ATsrAgd-5KDe0jbUdO7FmIhSHkP4=",
//         description: "This is Creek campground, you have water here and nice views"},
//     {
//         name: "Hill", 
//         image: "https://media.gettyimages.com/photos/friends-hikers-sitting-beside-camp-and-tents-in-the-night-picture-id678554980?b=1&k=6&m=678554980&s=612x612&w=0&h=fG0j9Uon4Gs7vuEcJVG5dwlrC4I2qE4t6YqELypMnV0=",
//         description: "Up to the hill!"},
//     {
//         name: "Rest", 
//         image: "https://media.gettyimages.com/photos/illuminated-green-tent-under-stars-at-night-forest-picture-id614333886?b=1&k=6&m=614333886&s=612x612&w=0&h=D5XJWPl0N7a2VDOcCkE2vqBn6CbYZ6D3W5WZQbuFTTI=",
//         description: "Definitly a place to rest from everything, including shower"},
//     {
//         name: "Campiness", 
//         image: "https://media.gettyimages.com/photos/father-and-son-camping-together-picture-id833226490?b=1&k=6&m=833226490&s=612x612&w=0&h=DLMj5yTtYcUzxhpqDkALL6q5JMPNaulqayrgdMm-5L4=",
//         description: "The place to live on camp"},
//     {
//         name: "Mount", 
//         image: "https://media.gettyimages.com/photos/man-is-sitting-around-a-campfire-and-just-relaxing-picture-id628138888?b=1&k=6&m=628138888&s=612x612&w=0&h=TxHM3hp4s4bLdn4KCJ-GgZD9lyRRnk3hA8_AWcoJluw=",
//         description: "You will find great view on mountains here"},
//     {
//         name: "Park", 
//         image: "https://images.freeimages.com/images/small-previews/064/winter-tent-1405339.jpg",
//         description: "Nice park, no place to live"}
// ];

// // --- moved to /models
// var campgroundSchema = new mongoose.Schema({
//     name: String,
//     image: String,
//     description: String,
// });

// var Campground = mongoose.model("Campground", campgroundSchema);

// // --- this was creation for the first time
// Campground.create({
//     name: "Creek",
//     image: "https://media.gettyimages.com/photos/camping-tent-in-a-camping-in-a-forest-by-the-river-picture-id911995140?b=1&k=6&m=911995140&s=612x612&w=0&h=Ct_pGVJSGD_9hF8ATsrAgd-5KDe0jbUdO7FmIhSHkP4=",
//     description: "This is Creek campground, you have water here and nice views"
// }, function(err, campground){
//     if(err){
//         console.log(err)
//     } else {
//         console.log(campground)
//     }
// });


//INDEX - show all campgrounds
router.get("/", function(req,res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err)
        } else {
            res.render("campgrounds/index",{campgrounds: allCampgrounds});
        }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author: author};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err) {
            console.log(err)
        } else {
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err) {
            console.log(err)
        } else {
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT route
router.get("/:id/edit", middleware.checkUserCampground, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

//UPDATE route
router.put("/:id", checkCampgroundOwnership, function(req, res){
    var newData = {name: req.body.name, image: req.body.image, description: req.body.desc};
    Campground.findByIdAndUpdate(req.params.id, 
        {$set: newData}, function(err, campground){
        if(err){
            req.flash("error", err.message)
            res.redirect("back");
        } else {
            req.flash("success", "Successfully updated")
            res.redirect("/campgrounds/" + campground._id);
        }
    });
});

//DESTROY route
router.delete("/:id", checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndDelete(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// };

function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, campground){
            if(campground.author.id.equals(req.user._id)){
                return next();
            } else {
                res.send("No permissions to do that");
            }
        });           
    }
}

module.exports = router;