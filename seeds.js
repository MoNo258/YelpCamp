var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");

var data = [
    {
        name: "Creek", 
        image: "https://media.gettyimages.com/photos/camping-tent-in-a-camping-in-a-forest-by-the-river-picture-id911995140?b=1&k=6&m=911995140&s=612x612&w=0&h=Ct_pGVJSGD_9hF8ATsrAgd-5KDe0jbUdO7FmIhSHkP4=",
        description: "This is Creek campground, you have water here and nice views. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author:{
            id : "588c2e092403d111454fff76",
            username: "MN"
        }
    },
    {
        name: "Hill", 
        image: "https://media.gettyimages.com/photos/friends-hikers-sitting-beside-camp-and-tents-in-the-night-picture-id678554980?b=1&k=6&m=678554980&s=612x612&w=0&h=fG0j9Uon4Gs7vuEcJVG5dwlrC4I2qE4t6YqELypMnV0=",
        description: "Up to the hill! Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author:{
            id : "588c2e092403d111454fff77",
            username: "Jack"
        }
    },
    {
        name: "Rest", 
        image: "https://media.gettyimages.com/photos/illuminated-green-tent-under-stars-at-night-forest-picture-id614333886?b=1&k=6&m=614333886&s=612x612&w=0&h=D5XJWPl0N7a2VDOcCkE2vqBn6CbYZ6D3W5WZQbuFTTI=",
        description: "Definitly a place to rest from everything, including shower. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author:{
            id : "588c2e092403d111454fff78",
            username: "Mike"
        }
    }
]

function seedDB(){
   //Remove all campgrounds
   Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
         //add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a campground");
                    //create a comment
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet",
                            author:{
                                id : "588c2e092403d111454fff76",
                                username: "MN"
                            }
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;
