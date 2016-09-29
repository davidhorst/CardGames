'use strict'
var Deck = require('./decks.js');
var Player = require('./player.js')
class War {
    constructor(gameId) {
        this.name = "war";
        this.totalPlayers = 4
        this.gameId = gameId;
        this.playerMap = []
        this.state = 'waiting';
        this.playerTurn = null;
        this.Deck = new Deck();
        this.cardsOnBoard = [];

    }

    getState() {
        let currentState = {};
        currentState.gameId = this.gameId;
        currentState.capacity = [this.playerMap.length, this.totalPlayers]
        currentState.state = this.state;
        currentState.playerMap = this.playerMap;
        currentState.cardsOnBoard = this.cardsOnBoard;

        return currentState;
    }

    // Add Player to game instance
    add(userName, socketId) {
        const player = new Player(userName, socketId);

        //bug when a player leaves game.... how to tell...

        // this.playerMap.forEach(function(playerObj) {
        //     //if there is a player object with a blank socketId, fill that in first. ( because a player dropped )
        //         Object.keys(playerId)[0] == socketId;
        //         return playerObj;
        //     }
        // });
        //if no player objects soket ids have been dropped, create a new user


       this.playerMap.push(player);
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
        this.Deck.shuffle();
        const numPlayers = this.playerMap.length;
        for(let i=0; i<=51; i++) {
            let playerIdx = i%numPlayers;
            this.playerMap[playerIdx].getCard(this.Deck);
        }
    }

    nextPlayerTurn() {
        //helper to always keep player turns bound by numplayers
        const numPlayers = this.playerMap.length;
        this.playerTurn = (this.playerTurn + 1) % numPlayers;

        //skips players who are out of cards
        if(this.playerMap[this.playerTurn].outOfCards == true) {
            nextPlayerTurn();
        }
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
        //if a player has run out of cards, remove them from the game
        removeLosers();
        winnerCheck();
    }



    removeLosers() {
        this.playerMap.forEach(function(player) {
            if(player.hand.length === 0) {
                //if true, when next player is called anyone with outOfCards will be skipped
                player.outOfCards = true;
            }
        });
    }

    winnerCheck() {
        let playersWithCards = [];
        this.playerMap.forEach(function(player) {
            if(player.hand.length > 0) {
                playersWithCards.push(player);
            }
        });
        if(playersWithCards.length === 1){
            this.state = 'gameOver';
            //put in code to emit to player they won
        }
    }

    recieveAction(playerId, data, io) {
        //this is the state machine which will validate if the user and action
        // are acceptable and returns the new states of the ui to all users

        if(!data){
             return this.getState();
        }

        if(this.state == 'waiting') {
            if(data.startGame) {
                this.deal();
                this.playerTurn = 0;
                this.state = 'playing'
                //emits data updating peoples games
                console.log('changed to playing')
                return this.getState();
            }
            else if(data.joinGame) {
                //only allow up to 4 users to join game
                if(this.playerMap.length <= 4) {

                    //if the user is taking someones seat, they need that persons player information
                    var player = this.add(data.userName, playerId)
                    playerId.emit('gameJoined', player )
                    return this.getState();
                }
            }
        }
        if(this.state == 'playing') {
                  //grabing out the current players ID
            if( this.playerMap[this.playerTurn] == this.playerId) {
                if(data.playedCard) {
                    const player = this.playerMap[this.playerTurn];
                 this.cardsOnBoard.push({player:player, card:player.shift()})
                }
             }
         }
         if(this.cardsOnBoard == this.playerMap.length) {
             this.resolveCardsOnBoard();
         }
         this.nextPlayerTurn();


         return this.getState();
    } // End recieveAction

} // End War Class

module.exports = War;
