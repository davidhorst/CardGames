'use strict'
var Deck = require('./decks.js');
var Player = require('./player.js')
class War {
    constructor(gameId, userName, socket_id) {
        this.gameId = gameId;
        const player = new Player(userName);
        this.PlayerMap = [ {socket_id : player} ];
        this.gameState = 'waiting'
        this.PlayerTurn = null;
        this.Deck = new Deck();
    }

    getState() {
        //returns current state of game
    }

    add(userName, socketId) {
        Player = new Player(userName);
        this.PlayerMap.push( {socketId : Player} );
    }

    remove(socketId) {
        for(var i=0; i<this.PlayerMap.length; i++) {
            if(this.PlayerMap[i].socket_id == socketId) {
                //code here to clean up any data when a Player leaves a game
                this.PlayerMap.splice(i, 1);
                break;
            }
        }
    }


    deal() {
        const numPlayers = PlayerMap.length;
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
            // if(this.PlayerTurn == this.PlayerMap[data
            //     //gameTurn will be a PlayerObj
        }

    }

}

module.exports = new War();
