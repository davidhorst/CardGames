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
}
module.exports = new RunningGames();
