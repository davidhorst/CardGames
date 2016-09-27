'use strict';
//holds games and has methods to add and remove games from server

var War = require('./games/war.js');

class RunningGames {
    constructor() {
        this.games = {};
        //id:gameObj
    }

    add(game_obj){
        const gameGuid = game_obj.gameId;
        this.games[gameGuid] = game_obj;
        return gameGuid;
    }

    remove(game_id) {
        //code here to remove any data from users that are in the game_id
        delete this.games[game_id];
    }

    get(game_id) {
        return this.games[game_id];
    }

    show(game_name) {
      const gamesArr = [];
      const gamesObj = this.games;
      Object.keys(gamesObj).forEach(function (key) {
        // console.log("key:", key)
        let game = gamesObj[key];
        if ( gamesObj[key] instanceof War ){
          gamesArr.push(gamesObj[key].getState());
        };
      });
      return gamesArr
    }
}
module.exports = new RunningGames();
