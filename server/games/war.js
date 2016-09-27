'use strict'
var Deck = require('./decks.js');
var Player = require('./player.js')
class War {
    constructor(gameId, userName, socket_id) {
        this.gameId = gameId;
        const player = new Player(userName);
        this.playerMap = []
        //this.playerMap = {socketId : playerObj}
        //must only have one key:value pair per obj.
        const derp = {}
        derp[socket_id] = player;
        this.playerMap.push(derp);
        this.gameState = 'waiting';
        this.playerTurn = null;
        this.cardsOnBoard = [];
        this.Deck = new Deck();
    }

    getState() {
        //will return all of the game state. for now, just returns this.gamestate
        let currentState = {};
        currentState.gameState = this.gameState;
        currentState.playerMap = this.playerMap;
        currentState.cardsOnBoard = this.cardsOnBoard;

        return currentState;
    }

    add(userName, socketId) {
        player = new Player(userName);
        this.playerMap.forEach(function(player) {
            //if there is a player object with a blank socketId, fill that in first. ( because a player dropped )
            if(Object.keys(player)[0] == '') {
                Object.keys(player)[0] == socketId;
                return
            }
        });
        //if no player objects soket ids have been dropped, create a new user
       const derp = {}
       derp[socket_id] = player;
       this.playerMap.push(derp);
       

    }

    remove(socketId) {
        for(var i=0; i<this.playerMap.length; i++) {
            if(this.playerMap[i].socket_id == socketId) {
                //code here to clean up any data when a Player leaves a game

                //the player object sticks around, so it can be sat at by a new player.
                this.playerMap[i].socket_id = '';
                break;
            }
        }
    }

    dealDeck() {
        //give all players a near even amount of cards
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

    recieveAction(data, playerId) {
        //this is the state machine which will validate if the user and action
        // are acceptable and returns the new states of the ui to all users
        if(this.gameState == 'waiting') {
            if(data.startGame) {
                //start game will be sent by the creator of the game room.
                //perhaps by a button click

                this.dealDeck();

                //could randomize the playturn
                this.playerTurn = 0;
                this.gameState = 'playing'

                //emits data updating peoples games
                return getState();
            }
            else if(data.joinGame) {
                //only allow up to 4 users to join game
                if(this.playerMap.length <= 4) {
                    this.add(data.userName, playerId)
                    return getState();
                }
            }
        }
        if(this.gameState == 'playing') {
                    //grabing out the current players ID
            if(Object.keys(playerMap[this.playerTurn])[0] == this.playerId) {
                if(data.playedCard) {
                    const player = playerMap[this.playerTurn][this.playerId]
                    this.cardsOnBoard.append({player:player, card:player.shift()})
                }
            }
            if(cardsOnBoard == playerMap.length) {
                this.resolveCardsOnBoard();
            }
            this.nextPlayerTurn();
        }
    return getState();
    }

}

module.exports = War;
