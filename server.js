// BASE SETUP
// ==================================

var User = require('./app/models/user');

// CALL PACKAGES --------------------
var express = require('express'); // call express
var app = express(); // define the app using express
var bodyParser = require('body-parser'); // get body-parser
var morgan = require('morgan'); // get morgan - allows logging requests to console
var mongoose = require('mongoose'); // ODM to communicate with MongoDB
var port = process.env.PORT || 8080; // set the port

// APP CONFIGURATION ----------------
// body-parser to grab information from POST requests

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// configure app to handle CORS requests
app.use( function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', 
    'X-Requested-With,content-type, \Authorization');
  next();
});

// log all requests to the console
app.use(morgan('dev'));

// DATABASE -------------------------
// connect to database (hosted on modulus.io)

// mongoose.connect('mongodb://<user>:<pass>@apollo.modulusmongo.net:27017/ne8haqaZ')
// *** what is 27017 ???
mongoose.connect('mongodb://localhost:27017/mean-crm-api-db')


// ROUTES FOR OUR API
// ==================================

// basic route for the home page
app.get('/', function(req, res){
  res.send('Welcome to the home page!');
});

// get an instance of the express router
var apiRouter = express.Router();

// middleware for all requests
apiRouter.use(function(req, res, next){
  // log
  console.log('visit to the app - test middleware');

  //
  // INSERT user authentication here
  // 

  next(); // continue to next routes (e.g. don't stop)

})

// test route to make sure everything is working
// accessed at GET http://localhost:8080/api
apiRouter.get('/', function(req, res){
  res.json({ message: 'welcome to the api'});
});

//
// INSERT more routes HERE
//

// USER ROUTES ----------------------
// routes that end in /users
apiRouter.route('/users')
  // create a user (accessed at POST http://localhost:8080/api/users)
  .post(function(req, res){
    // create a new instance of the User model
    var user = new User();

    // set the users information (comes from request)
    user.name = req.body.name;
    user.username = req.body.username;
    user.password = req.body.password;

    // save the user and check for errors
    user.save(function(err){
      if (err) {
        // duplicate entry
        if (err.code == 11000)
          return res.json({
            success: false,
            message: 'User with that username already exists.'
          });
        else
          return res.send(err);
      }

      res.json({
        message: 'User created.'
      }); // closes res.json
    }); // closes user.save
  }) // closes .post
  // get all users (accessed at GET http://localhost:8080/api/users)
  .get(function(req, res){
    User.find(function(err, users){
      if (err) res.send(err);

      // return the users
      res.json(users);
    }); // close User.find
  }); // close .get

  apiRouter.route('/users/:user_id')
    // GET Get the user with :user_id (accessed at GET http://localhost:8080/api/users/:user_id)
    .get(function(req, res){
      User.findById(req.params.user_id, function(err, user){
        if(err) res.send(err);

        // return the user
        res.json(user);

      }); // close User.findById
    }) // close .get
    // PUT Update the user with :user_id (accessed at POST http://localhost8080/api/users/:user_id)
    .put(function(req,res){
      User.findById(req.params.user_id, function(err, user){
        if(err) res.send(err);

        // update the user info only if it is new
        // (e.g. do not want to update to blanks if nothing is filled in)
        if (req.body.name) user.name = req.body.name;
        if (req.body.username) user.username = req.body.username;
        if (req.body.password) user.password = req.body.password;

        user.save(function(err){
          if (err) res.send(err);

          // return message indicating changes are saved
          res.json({
            message: 'user updated.'
          }); // close res.json
        }); // close user.save
      }); // close User.findById
    }) // close .put
    .delete(function(req, res){
      User.remove({
        _id: req.params.user_id
      }, function(err, user){
        if (err) return res.send(err);

        res.json({
          message: 'user deleted.'
        }); // close res.json
      }); // close User.remove
    }); // close .delete

// REGISTER ROUTES ------------------
// all routes will be prefixed with /api

app.use('/api', apiRouter);

// START THE SERVER
// ==================================

app.listen(port);
console.log('magic happens on port ' + port);