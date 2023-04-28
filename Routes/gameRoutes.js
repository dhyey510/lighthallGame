const express = require("express");
const {
  homePage,
  createGamePage,
  createOwnGame,
  result,
  redirectPage,
  userPlayGame,
  leaderboard,
} = require("../Controller/gameController");

const router = express.Router();

//GET /:name  ->  home page of game
router.get("/:name", homePage);

//GET /:name/game -> play game page
router.get("/:playername/game", createGamePage);

//GET /:name/game/:status -> show result and leaderboard
router.get("/:playername/game/:status", result);

//GET /:name/leaderborad -> show leaderboard
router.get("/:name/leaderboard", leaderboard);

//GET /:name/game/create -> create own game
router.get("/:name/creategame", createOwnGame);

//GET /:name/game/:gameId/play -> another user try to play game
router.get("/:name/creategame/:gameId/play", redirectPage);

//GET /:name/game/:gameId/:playername/play -> play game
router.get("/:createdname/creategame/:gameId/:playername/play", userPlayGame);

module.exports = router;
