const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  playersName: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
  ],
  word: String,
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
