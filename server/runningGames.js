'use strict';
//holds games and has methods to add and remove games from server

var War = require('./games/war.js');

class RunningGames {
    constructor() {
        this.games = {};
    };

    // Returns minimal details of current running games
    index() {
      const gamesArr = [];
      const gamesObj = this.games;
      Object.keys(gamesObj).forEach(function (key) {
        let game = gamesObj[key];
        gamesArr.push(game.getMinState());
      });
      return gamesArr
    };

    // show(gameId){
    //
    // };

    add(game_obj){
        const gameGuid = game_obj.gameId;
        this.games[gameGuid] = game_obj;
        return gameGuid;
    };

    // remove(game_id) {
    //     //code here to remove any data from users that are in the game_id
    //     delete this.games[game_id];
    // }

    get(game_id) {
        return this.games[game_id];
    };

}
module.exports = new RunningGames();
