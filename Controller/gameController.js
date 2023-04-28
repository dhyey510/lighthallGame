const Game = require("../Models/gameModel");
const Player = require("../Models/playerModel");
const mongoose = require("mongoose");

const wordList = [
  "affix",
  "azure",
  "blizzard",
  "buffalo",
  "cobweb",
  "crypt",
  "duplex",
  "cycle",
  "faking",
  "flopping",
  "funny",
  "galaxy",
  "gizmo",
  "glyph",
  "gossip",
  "icebox",
  "injury",
  "jackpot",
  "jawbreaker",
  "jazzy",
  "khaki",
  "knapsack",
  "quiz",
  "rhythm",
  "snazzy",
  "scratch",
  "stretch",
  "squawk",
  "quartz",
  "stymied",
  "syndrome",
  "transplant",
  "vixen",
  "vortex",
  "woozy",
  "zigzag",
  "zombie",
];

//get homepage
const homePage = (req, res) => {
  res.status(200).json({ msg: "Homepage" });
};

//play game page
const createGamePage = async (req, res) => {
  const randNo = Math.floor(Math.random() * (wordList.length - 1));
  const newGame = new Game({
    createdBy: "Computer",
    word: wordList[randNo],
  });

  await Player.find({ name: req.params.playername })
    .then((player) => {
      if (player.length != 0) {
        newGame.playersName.push(player[0]);
      } else {
        const newPlayer = new Player({
          name: req.params.playername,
          noOfGameWon: 0,
        });
        newPlayer
          .save()
          .then((p) => {
            newGame.playersName.push(p);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    })
    .catch((e) => {
      console.log(e);
    });
  newGame
    .save()
    .then((game) => {
      res.json({ msg: `${game}` });
    })
    .catch((e) => {
      console.log(e);
    });
};

//for result page
const result = async (req, res) => {
  if (req.params.status === "win") {
    await Player.find({ name: req.params.playername })
      .then((player) => {
        player[0].noOfGameWon += 1;
        player[0].save();
      })
      .catch((e) => {
        console.log(e);
      });
  }
  await Player.find({})
    .then((players) => {
      res.json(players);
    })
    .catch((e) => {
      console.log(e);
    });
};

//leaderboard page
const leaderboard = async (req, res) => {
  await Player.find({})
    .then((players) => {
      console.log("hiii");
      res.json(players);
    })
    .catch((e) => {
      console.log(e);
    });
};

//create own game
const createOwnGame = async (req, res) => {
  const newGame = new Game({
    word: req.body.word,
    createdBy: req.params.name,
    playersName: [],
  });

  await newGame
    .save()
    .then((game) => {
      const newUrl =
        req.protocol +
        "://" +
        req.get("host") +
        req.originalUrl +
        "/" +
        game.id +
        "/play";
      res.json(newUrl);
    })
    .catch((e) => {
      console.log(e);
    });
};

//ask for user name and redirect
const redirectPage = (req, res) => {
  //ask user name as input
  res.redirect(
    `/${req.params.name}/creategame/${req.params.gameId}/${req.body.playername}/play`
  );
};

//multiple user play game
const userPlayGame = async (req, res) => {
  const newGame = await Game.findOne({ _id: req.params.gameId });
  const player = await Player.findOne({ name: req.params.playername });

  if (player != null) {
    for (let i = 0; i < newGame.playersName.length; i++) {
      if (newGame.playersName[i]._id.equals(player._id)) {
        res.json({ msg: "You already played this game!!" });
        return;
      }
    }
    newGame.playersName.push(player);
  } else {
    const newPlayer = new Player({
      name: req.params.playername,
      noOfGameWon: 0,
    });
    newPlayer
      .save()
      .then((p) => {
        newGame.playersName.push(p);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  newGame
    .save()
    .then((game) => {
      res.json(game);
    })
    .catch((e) => {
      console.log(e);
    });
};

module.exports = {
  homePage,
  createGamePage,
  createOwnGame,
  result,
  redirectPage,
  userPlayGame,
  leaderboard,
};
