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
        return this.gameState
    }

    add(userName, socketId) {
        Player = new Player(userName);
        this.playerMap.push( {socketId : Player} );
    }

    remove(socketId) {
        for(var i=0; i<this.playerMap.length; i++) {
            if(this.playerMap[i].socket_id == socketId) {
                //code here to clean up any data when a Player leaves a game
                this.playerMap.splice(i, 1);
                break;
            }
        }
    }


    dealDeck() {
        const numPlayers = playerMap.length;
        for(const i=0; i<=52; i++) {
            const PlayerIdx = i%numPlayers;
            playeMap[1].getCard(this.Deck);
        }
    }

    nextPlayerTurn() {
        numPlayers = playerMap.length;
        playerTurn = (playerTurn + 1) % 4;
    }

    resolveCardsOnBoard() {
        //logic to find winner of round
            //default value is always beatable
        let bestCard = [{rank: 0}]

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
        }

        if(bestCard.length == 0) {
            //one player won. they get all the cards!
            this.cardsOnBoard.forEach(funciton(boardObj) {
                bestCard[0].player.hand.append(boardObj.card)
            })
        } else {
            this.cardsOnBoard.forEach(funciton(boardObj) {
                boardObj.
            }

            //multiple players won. they go to war!!

        }


        });
    }

    recieveAction(playerId, data) {
        //this is the state machine which will validate if the user and action
        // are acceptable and returns the new states of the ui to all users
        if(this.gameState == 'waiting') {
            if(data.startGame) {
                this.dealDeck();
                this.playerTurn = 0;
                //could randomize the playturn
                this.gameState = 'playing'
                //emit data updating peoples games
                return getState();
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
                }
            }
            if(this.cardsOnBoard == playerMap.length) {
                this.resolveCardsOnBoard();
            }
            this.nextPlayerTurn();
        }

    return getState();
    }

}

module.exports = War;
