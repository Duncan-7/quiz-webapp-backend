const Fourdoors = require('../models/fourdoors');
const User = require('../models/user');

exports.createPlaythrough = function (req, res) {
  const playthrough = new Fourdoors({
    user: req.body.user,
    winnings: req.body.winnings,
    round: req.body.round,
    complete: req.body.complete,
    updated: new Date()
  });
  playthrough.save(function (err, playthrough) {
    if (err) {
      res.status(500)
        .json({
          error: 'Internal error please try again'
        });
    } else {
      User.findById(playthrough.user).exec(function (err, user) {
        if (err) {
          res.status(500)
            .json({
              error: 'Error finding user balance'
            });
        } else {
          const updatedUser = new User({
            _id: user._id,
            email: user.email,
            password: user.password,
            balance: (user.balance > 50 ? user.balance - 50 : 0),
            admin: user.admin
          });
          User.findByIdAndUpdate(user._id, updatedUser, {}, function (err) {
            if (err) {
              console.log(err);
              res.status(500)
                .json({
                  error: 'Error updating user balance'
                });
            }
            console.log("user updated")
          })
        }
      })
      res.json({ gameId: playthrough._id });
    }
  });
}

exports.updatePlaythrough = function (req, res) {
  const updatedPlaythrough = new Fourdoors({
    user: req.body.user,
    winnings: req.body.winnings,
    round: req.body.round,
    complete: req.body.complete,
    updated: new Date(),
    _id: req.params.id
  });
  Fourdoors.findByIdAndUpdate(req.params.id, updatedPlaythrough, {}, function (err, updated) {
    if (err) {
      console.log(err);
      res.status(500)
        .json({
          error: 'Internal error please try again'
        });
    } else {
      res.status(200).send("Game Updated");
    }
  });
}

exports.playRound = function (req, res, next) {
  Fourdoors.findById(req.params.id).exec(function (err, playthrough) {
    if (err) {
      res.status(500)
        .json({
          error: 'Internal error please try again'
        });
    } else if (playthrough.complete) {
      res.status(500)
        .json({
          error: 'This playthrough has already concluded'
        });
    } else {
      const currentRound = playthrough.round;
      const prizesArray = []
      prizesArray.push("You lose");
      prizesArray.push(currentRound * 10);
      prizesArray.push(currentRound * 20);
      prizesArray.push(currentRound * 30);
      shuffleArray(prizesArray);
      const playerSelection = req.body.selection;
      const playerPrize = prizesArray[playerSelection];
      const updatedPlaythrough = new Fourdoors({
        user: playthrough.user,
        round: playthrough.round,
        updated: new Date(),
        _id: req.params.id
      })
      if (playerPrize === "You lose") {
        updatedPlaythrough.complete = true;
        updatedPlaythrough.winnings = 0;
        console.log(updatedPlaythrough);
      } else {
        updatedPlaythrough.complete = false;
        updatedPlaythrough.winnings = playthrough.winnings + playerPrize;
        console.log(updatedPlaythrough);
      }
      Fourdoors.findByIdAndUpdate(req.params.id, updatedPlaythrough, {}, function (err, updated) {
        if (err) {
          console.log(err);
          res.status(500)
            .json({
              error: 'Internal error please try again'
            });
        } else {
          res.status(200)
            .json({
              results: prizesArray,
              playthrough: updatedPlaythrough,
              playerSelection: playerPrize
            });
        }
      });
    }
  });
}

exports.nextRound = function (req, res, next) {
  Fourdoors.findById(req.params.id).exec(function (err, playthrough) {
    if (err) {
      res.status(500)
        .json({
          error: 'Internal error please try again'
        });
    } else if (playthrough.complete) {
      res.status(500)
        .json({
          error: 'This playthrough has already concluded'
        });
    } else {
      const updatedPlaythrough = new Fourdoors({
        user: playthrough.user,
        round: playthrough.round + 1,
        winnings: playthrough.winnings,
        complete: playthrough.complete,
        updated: new Date(),
        _id: req.params.id
      })
      Fourdoors.findByIdAndUpdate(req.params.id, updatedPlaythrough, {}, function (err, updated) {
        if (err) {
          console.log(err);
          res.status(500)
            .json({
              error: 'Internal error please try again'
            });
        } else {
          res.status(200)
            .json({
              playthrough: updatedPlaythrough
            });
        }
      });
    }
  });
}

exports.cashOut = function (req, res, next) {
  Fourdoors.findById(req.params.id).exec(function (err, playthrough) {
    if (err) {
      res.status(500)
        .json({
          error: 'Internal error please try again'
        });
    } else if (playthrough.complete) {
      res.status(500)
        .json({
          error: 'This playthrough has already concluded'
        });
    } else {
      const updatedPlaythrough = new Fourdoors({
        user: playthrough.user,
        round: playthrough.round,
        winnings: playthrough.winnings,
        updated: new Date(),
        complete: true,
        _id: req.params.id
      })
      Fourdoors.findByIdAndUpdate(req.params.id, updatedPlaythrough, {}, function (err, updated) {
        if (err) {
          console.log(err);
          res.status(500)
            .json({
              error: 'Internal error please try again'
            });
        } else {
          User.findById(updatedPlaythrough.user).exec(function (err, user) {
            if (err) {
              res.status(500)
                .json({
                  error: 'Error finding user balance'
                });
            } else {
              const updatedUser = new User({
                _id: user._id,
                email: user.email,
                password: user.password,
                balance: user.balance + updatedPlaythrough.winnings,
                admin: user.admin
              });
              User.findByIdAndUpdate(user._id, updatedUser, {}, function (err) {
                if (err) {
                  console.log(err);
                  res.status(500)
                    .json({
                      error: 'Error updating user balance'
                    });
                }
                console.log("user updated")
              })
            }
          })
          res.status(200)
            .json({
              playthrough: updatedPlaythrough
            });
        }
      });
    }
  });
}


function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  };
  return array;
}

