var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express){

  // ROUTES FOR OUR API
  // ==================================

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
            expiresInMinutes: config.userTokenExp // time to user login expiry
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
  }); // closes apiRouter.use

  // test route to make sure everything is working
  // accessed at GET http://localhost:8080/api
  apiRouter.get('/', function(req, res){
    res.json({ message: 'welcome to the api'});
  });

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

  return apiRouter;

}; // end function(app, express)