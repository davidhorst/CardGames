'use strict';
//holds games and has methods to add and remove games from server
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
        delete this.game[game_id];
    }

    get(game_id) {
        return this.game[game_id];
    }

    show(game_name) {
      const gamesArr = [];
      console.log(this.games);
      Object.keys(this.games).forEach(function (key) {
        let game = this.games[key];
        if (game.name === game_name){
          gamesArr.push(game);
        }
      });
      return gamesArr
    }
}
module.exports = new RunningGames();
