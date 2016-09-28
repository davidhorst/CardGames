'use strict'
var Deck = require('./decks.js');
var Player = require('./player.js')
class War {
    constructor(gameId) {
        this.name = "war";
        this.totalPlayers = 4
        this.gameId = gameId;
        this.playerMap = []
        this.gameState = 'waiting';
        this.PlayerTurn = null;
        this.Deck = new Deck();
    }

    getState() {
        let currentState = {};
        currentState.gameId = this.gameId;
        currentState.capacity = [this.playerMap.length, this.totalPlayers]
        currentState.state = this.gameState;
        currentState.playerMap = this.playerMap;
        currentState.cardsOnBoard = this.cardsOnBoard;

        return currentState;
    }

    // Add Player to game instance
    add(userName, socketId) {
        console.log(userName, socketId);
        const player = new Player(userName);
        console.log(player);
        this.playerMap.forEach(function(playerId) {
            //if there is a player object with a blank socketId, fill that in first. ( because a player dropped )
            if(Object.keys(playerId)[0] == '') {
                Object.keys(playerId)[0] == socketId;
                return player;
            }
        });
        //if no player objects soket ids have been dropped, create a new user
       const id_player_obj = {}
       id_player_obj[socketId] = player;
       this.playerMap.push(id_player_obj);
       return player
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

    nextPlayerTurn() {
        //helper to always keep player turns bound by numplayers
        numPlayers = playerMap.length;
        playerTurn = (playerTurn + 1) % numPlayers;
    }

    resolveCardsOnBoard() {
        // logic to find winner of round
            // default value is always beatable
        let bestCard = [{rank: 0}];

        //iterate over all played cards
        this.cardsOnBoard.forEach(function(boardObj) {

            //if current card is bigger than current winning rank
            if(boardObj.card.rank > bestCard[0].rank) {
                bestCard = [];
                bestCard.push(boardObj);
            }

            //if current card ties current best rank
            else if(boardObj.card.rank == bestCard[0].rank) {
                bestCard.push(boardObj);
            }
        });

        if(bestCard.length == 0) {
            //one player won. they get all the cards!
            for(let i = 0; i < this.cardsOnBoard.length; i++) {
                bestCard[0].player.hand.append(this.cardsOnBoard[i].card);
            }
        } else {
            //multiple players won. they go to war!!
        }
    }

    recieveAction(playerId, data, io) {
        //this is the state machine which will validate if the user and action
        // are acceptable and returns the new states of the ui to all users
        if(this.gameState == 'waiting') {
            if(data.startGame) {
                this.deal();
                this.PlayerTurn = 0;
                this.gameState = 'playing'
                //emits data updating peoples games
                return getState();
            }
            else if(data.joinGame) {
                //only allow up to 4 users to join game
                if(this.playerMap.length <= 4) {

                    //if the user is taking someones seat, they need that persons player information
                    var player = this.add(data.userName, playerId)
                    playerId.emit('gameJoined', player )
                    return getState();
                }
            }
        }
        if(this.gameState == 'playing') {
            // if(this.PlayerTurn == this.playerMap[data
            //     //gameTurn will be a PlayerObj
        }
        return getState();
    } // End recieveAction

} // End War Class

module.exports = War;
