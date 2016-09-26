'use strict';
//holds games and has methods to add and remove games from server
class RunningGames {
    constructor() {
        this.games = {};
        //id:gameObj
    }

    add(game_obj){
        const gameGuid = guid();
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

    guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
        }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }

}
module.exports = new RunningGames();
