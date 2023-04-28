const express = require("express");
const {
  homePage,
  createGamePage,
  createOwnGame,
  result,
  redirectPage,
  userPlayGame,
  leaderboard,
  openCreateGamePage,
} = require("../Controller/gameController");

const router = express.Router();

//GET /:name  ->  home page of game
router.get("/game", homePage);

//GET /:name/game -> play game page
router.get("/game/play", createGamePage);

//GET /:name/game/:status -> show result and leaderboard
router.get("/:playername/game/:status", result);

//GET /:name/leaderborad -> show leaderboard
router.get("/game/leaderboard", leaderboard);

//GET /creategame -> open create page
router.get("/creategame", openCreateGamePage);

//GET /:name/game/create -> create own game
router.post("/creategame/link", createOwnGame);

//GET /:name/game/:gameId/play -> another user try to play game
router.get("/creategame/link/:gameId/play", redirectPage);

//GET /:name/game/:gameId/:playername/play -> play game
router.post("/creategame/link/:gameId/multiuserplay", userPlayGame);

module.exports = router;
