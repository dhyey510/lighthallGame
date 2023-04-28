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
  res.render("askUsernamePage.ejs", { createdByUser: false });
};

//play game page
const createGamePage = async (req, res) => {
  // console.log(req.query.playerName);
  const randNo = Math.floor(Math.random() * (wordList.length - 1));
  const newGame = new Game({
    word: wordList[randNo],
  });

  await Player.find({ name: req.query.playerName })
    .then(async (player) => {
      if (player.length != 0) {
        newGame.playersName.push(player[0]);
      } else {
        const newPlayer = new Player({
          name: req.query.playerName,
          noOfGameWon: 0,
        });
        const playerId = await newPlayer.save();
        newGame.playersName.push(playerId);
      }
    })
    .catch((e) => {
      console.log(e);
    });
  newGame
    .save()
    .then((game) => {
      res.render("gamePage.ejs", {
        game,
        playername: req.query.playerName,
        createdUser: false,
      });
    })
    .catch((e) => {
      console.log(e);
    });
};

//for result page
const result = async (req, res) => {
  if (req.params.status === "win") {
    const player = await Player.findOne({ name: req.params.playername });
    player.noOfGameWon += 1;

    const savePlayer = await player.save();
  }
  res.json({ msg: "save successfully" });
};

//leaderboard page
const leaderboard = async (req, res) => {
  await Player.find({})
    .then((players) => {
      players.sort(getSortedOrder("noOfGameWon"));
      res.render("leaderboard.ejs", { players });
    })
    .catch((e) => {
      console.log(e);
    });
};

const getSortedOrder = (prop) => {
  return function (a, b) {
    if (a[prop] < b[prop]) {
      return 1;
    } else if (a[prop] > b[prop]) {
      return -1;
    }
    return 0;
  };
};

const openCreateGamePage = (req, res) => {
  res.render("createGame.ejs", { link: null });
};

//create own game
const createOwnGame = async (req, res) => {
  const newGame = new Game({
    word: req.body.word,
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
      res.render("createGame.ejs", { link: newUrl });
    })
    .catch((e) => {
      console.log(e);
    });
};

//ask for user name and redirect
const redirectPage = (req, res) => {
  res.render("askUsernamePage.ejs", {
    createdByUser: true,
    gameId: req.params.gameId,
  });
};

//multiple user play game
const userPlayGame = async (req, res) => {
  const newGame = await Game.findOne({ _id: req.params.gameId });
  const player = await Player.findOne({ name: req.body.playerName });

  if (player != null) {
    for (let i = 0; i < newGame.playersName.length; i++) {
      if (newGame.playersName[i]._id.equals(player._id)) {
        // alert("You already played this game!!");
        return res.render("homePage.ejs", {
          error: "You already played this game!!",
        });
        // return;
      }
    }
    newGame.playersName.push(player);
  } else {
    const newPlayer = new Player({
      name: req.body.playerName,
      noOfGameWon: 0,
    });
    const playerId = await newPlayer.save();
    newGame.playersName.push(playerId);
  }
  newGame
    .save()
    .then((game) => {
      res.render("gamePage.ejs", {
        game,
        playername: req.body.playerName,
        createdUser: true,
      });
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
  openCreateGamePage,
};
