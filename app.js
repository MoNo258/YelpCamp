var express                 = require('express');
    app                     = express();
    request                 = require('request');
    bodyParser              = require('body-parser');
    mongoose                = require('mongoose');
    methodOverride          = require('method-override'),
    passport                = require('passport'),
    LocalStrategy           = require('passport-local'),
    passportLocalMongoose   = require("passport-local-mongoose"),
    Campground              = require('./models/campground');
    Comment                 = require('./models/comment');
    User                    = require('./models/user'),
    seedDB                  = require('./seeds');
    port                    = process.env.PORT || 3007;
    url                     = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp"

//requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");


// mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true});
// mongoose.connect("mongodb+srv://Monika:Monika@clustertest-aqjrn.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser: true});
mongoose.connect(url, {useNewUrlParser: true});


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
seedDB();


//passport config
app.use(require("express-session")({
    secret: "This is a sentence used for codeing and decoding of passwords",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



app.get("*", function(req, res){
    res.send("Sorry, page not found.");
});

app.listen(port, process.env.IP, function(){
    console.log('Port 3007 is working!');
});