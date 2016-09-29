'use strict';
const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');


function UsersController(){
    this.login = function(req,res){
        User.findOne({ email: req.body.email }, function(err, user) {
            if (err) {
                res.sendStatus(500);
            };
            if (user && user.comparePassword(req.body.password)) {
                var myToken = jwt.sign({user_id: user._id, user_name: user.name}, 'so secret')
                // console.log('login above cookie')
                res.cookie("token", myToken)
                 const user_json = JSON.stringify({user_id: user._id, user_name: user.name});
                res.cookie("current_user",user_json)
                // console.log('login below cookie')
                res.sendStatus(200);
            } else {
                res.sendStatus(500);
            }
        });
    };

    this.register = function(req,res){
        var user = new User(req.body);
        user.save(function(err, user) {
            if(err) {
                res.status(500).send({err});
            } else {
                var myToken = jwt.sign({_id: user._id, name: user.name}, 'so secret');
                res.status(200).json(myToken)
            }
        })
    };

    this.show = function(req, res) {
        User.findOne({_id: req.params.id}, function(err, data) {
            if(err) {
                res.sendStatus(500);
            } else {
                res.json(data);
            }
        });
    };

    this.testConnection = function () {
        console.log('YOU DID IT!')
    };

    this.getCurrentGame = function (req, res) {
      User.findOne({_id: req.body.userId }, function(err, user) {
          if (err) {
            pass // no one has time for this.
          } else {
            if (user) {
              res.json({data: user.currentGame});
            }
          }
      });
    };

    this.setCurrentGame = function (userId, gameId) {
        User.findOne({_id: userId }, function(err, user) {
            if (err) {
              pass // no one has time for this.
            } else {
              if (user) {
                user.currentGame = gameId;
                user.save();
              }
            }
        });
    };

    this.removeCurrentGame = function (userId) {
        User.findOne({_id: userId }, function(err, user) {
            if (err) {
              pass // no one has time for this.
            } else {
              if (user) {
                user.currentGame = null;
                user.save();
              };
            };
        });
    };
};

module.exports = new UsersController();
