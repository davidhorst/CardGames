'use strict'
var Deck = require('./decks.js');
var Player = require('./player.js')
class War {
    constructor(gameId, userName, socket_id) {
        this.name = "war";
        this.gameId = gameId;
        const player = new Player(userName);
        this.playerMap = []
        const derp = {}
        derp[socket_id] = player;
        this.playerMap.push(derp);
        this.gameState = 'waiting';
        this.PlayerTurn = null;
        this.Deck = new Deck();
    }

    getState() {
        //will return all of the game state. for now, just returns this.gamestate
        return this.gameState
    }

    // Add Player to game instance
    add(userName, socketId) {
        Player = new Player(userName);
        this.playerMap.push( {socketId : Player} );
    }

    // Remove player from game instance
    remove(socketId) {
        for(var i=0; i<this.playerMap.length; i++) {
            if(this.playerMap[i].socket_id == socketId) {
                //code here to clean up any data when a Player leaves a game
                this.playerMap.splice(i, 1);
                break;
            }
        }
    }


    deal() {
        const numPlayers = playerMap.length;
        for(const i=0; i<=52; i++) {
            const PlayerIdx = i%numPlayers;
            playeMap[1].getCard(this.Deck);
        }
    }

    recieveAction(data) {
        //this is the state machine which will validate if the user and action
        // are acceptable and returns the new states of the ui to all users
        if(this.gameState == 'waiting') {
            if(data.startGame) {
                this.deal();
                this.PlayerTurn = 0;
                this.gameState = 'playing'
            }
        }
        if(this.gameState == 'playing') {
            // if(this.PlayerTurn == this.playerMap[data
            //     //gameTurn will be a PlayerObj
        }

    }

}

module.exports = War;
