// BASE SETUP
// ==================================

var User = require('./app/models/user');
var superSecret = 'thiswouldntreallygoongit';
var userTokenExp = 1440; // minutes to user login expiry - 24 hours

// CALL PACKAGES --------------------
var express = require('express'); // call express
var app = express(); // define the app using express
var bodyParser = require('body-parser'); // get body-parser
var morgan = require('morgan'); // get morgan - allows logging requests to console
var mongoose = require('mongoose'); // ODM to communicate with MongoDB
var port = process.env.PORT || 8080; // set the port
var jwt = require('jsonwebtoken');

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

// route for authenticating users
apiRouter.post('/authenticate', function(req, res){
  // find user, select name, username and password explicitly
  User.findOne({
    username: req.body.username
  }) // close .findOne
  .select('name username password')
  .exec(function(err, user){
    if (err) throw err; // *** why use "throw" here, everywhere else return res.send(err) ???

    // no user with that username was found
    if (!user) {

      res.json({
        success: false,
        message: 'Authentication failed. User not found.'
      }); // close res.json

    } else if (user) {

      // check if password matches
      var validPassword = user.comparePassword(req.body.password); // method defined user.js

      if (!validPassword) {

        res.json({
          success: false,
          message: 'Authentication failed. Incorrect password'
        });

      } else {

        // if use is found and password is valid _then_ create a token
        var token = jwt.sign({
          name: user.name,
          username: user.username
        }, superSecret, {
          expiresInMinutes: userTokenExp // time to user login expiry
        }); // close jwt.sign

        // return information including token as JSON
        res.json({
          success: true,
          message: "Token issued.",
          token: token
        }) // close res.json 
      } // end conditional chain if (!validPassword) ... else
    } // end conditional chain if (!user) ... else if (user)

  }); // close .exec
}); // close apiRouter.post

// middleware for all requests authenticated
apiRouter.use(function(req, res, next){
  // log
  console.log('visit to the app - test middleware');

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, superSecret, function(err, decoded){
      if (err) {

        return res.status(403).send({
          success: false,
          message: 'Failed to authenticate'
        }); // close res.status(403).send

      } else {

        // no authentication error, save request for use in other routes
        req.decoded = decoded;

        next(); // continue to next routes (beyond homepage) only if token verified
      } // close if (err) ... else conditional

    }); // close jwt.verify

  } else {

    // no token provided
    // return HTTP response 403 (access forbidden) and error message
    return res.status(403).send({
      success: false,
      message: 'no token provided'
    })

  }

});

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

    // api endpoint to get current user information
    apiRouter.get('/me', function(req, res){
      
      res.send(req.decoded);
    
    }); // close apiRouter.get('/me'...

// REGISTER ROUTES ------------------
// all routes will be prefixed with /api

app.use('/api', apiRouter);

// START THE SERVER
// ==================================

app.listen(port);
console.log('magic happens on port ' + port);