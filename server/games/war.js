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
        currentState.name = this.name;
        currentState.gameId = this.gameId;
        currentState.capacity = [this.playerMap.length, this.totalPlayers]
        currentState.state = this.state;
        currentState.playerMap = this.playerMap;
        currentState.cardsOnBoard = this.cardsOnBoard;

        return currentState;
    }

    // Add Player to game instance
    add(userName, socketId) {
        const player = new Player(userName, userId, socketId);

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
        for(let i=1; i<=12; i++) {
            let playerIdx = i%numPlayers;
            this.playerMap[playerIdx].getCard(this.Deck);

        }
    }

    nextPlayerTurn() {
        //helper to always keep player turns bound by numplayers
        const numPlayers = this.playerMap.length;

        this.playerTurn = (this.playerTurn + 1) % numPlayers;
        console.log('playerTurn')
        console.log(this.playerTurn)
        //skips players who are out of cards
        if(this.playerMap[this.playerTurn].outOfCards == true) {
            nextPlayerTurn();
        }
    }

    resolveCardsOnBoard(io) {
        // logic to find winner of round
            // default value is always beatable
        let bestCardObj = [];
        //iterate over all played cards
        this.cardsOnBoard.forEach(function(boardObj) {

            //if current card is bigger than current winning rank
            if(bestCardObj.length == 0){
                bestCardObj.push(boardObj);
            } else {
                if(boardObj.card.rank > bestCardObj[0].card.rank) {
                    bestCardObj = [];
                    bestCardObj.push(boardObj);
                }
                //if current card ties current best rank
                else if(boardObj.card.rank == bestCardObj[0].card.rank) {
                    bestCardObj.push(boardObj);
                }
            }
        });
        let pot = this.cardsOnBoard;
        if(bestCardObj.length > 1) {

            //add emit for goto war!!!!!!!
            io.to(this.gameId).emit('warMessage', bestCardObj);
            this.cardsOnBoard.forEach(function(boardObj) {
                bestCardObj[0].player.hand.push(boardObj.card);
            });
            io.to(this.gameId).emit('winningCard', bestCardObj[0]);
            // const winner = this.goToWar(bestCardObj, pot, io)
            // if(winner.player) {
            //     winner.pot.forEach(function(boardObj) {
            //             winner.player.hand.push(boardObj.card);
            //     });
            // } else {
            //     winner.pot.forEach(function(boardObj) {
            //         bestCardObj[0].player.hand.push(boardObj)
            //     });
            // }
        } else {

            this.cardsOnBoard.forEach(function(boardObj) {
                bestCardObj[0].player.hand.push(boardObj.card);
            });
        io.to(this.gameId).emit('winningCard', bestCardObj[0]);
        }
        this.removeLosers(io);
        this.winnerCheck(io);
        this.cardsOnBoard = [];
    }

        //bestCard = [{player:player, card:card}]
    goToWar(bestCardObj, pot,  io) {

        let cardsOnBoard = []

        bestCardObj.forEach(function(boardObj) {
            if(boardObj.player.hand.length > 2) {

                let card = boardObj.player.hand.shift()
                // emit card
                pot.push(card);
                card = boardObj.player.hand.shift()
                // emit card
                pot.push(card);
                card = boardObj.player.hand.shift()

                // emit card
                cardsOnBoard.push({'card': card, 'player': boardObj.player});
            } else {
                boardObj.player.hand.forEach(function(card) {
                    pot.push(card);
                });
            }

        });
        if(cardsOnBoard > 0) {
            this.cardsOnBoard.forEach(function(boardObj) {
                if(bestCardObj.length == 0){
                    bestCardObj.push(boardObj);
                } else {
                    console.log('boardObj');
                    console.log(boardObj);
                    console.log('bestCardObj[0]');
                    console.log(bestCardObj[0]);
                    if(boardObj.card.rank > bestCardObj[0].card.rank) {
                        bestCardObj = [];
                        bestCardObj.push(boardObj);
                    }
                    else if(boardObj.card.rank == bestCardObj[0].card.rank) {
                        bestCardObj.push(boardObj);
                    }
                }
            });
        } else {
            return {player:null, pot}
        }

        if(bestCardObj.length > 1) {

            //add emit for goto war again!

            const winner = this.goToWar(bestCardObj, pot, io)
            winner.pot.forEach(function(boardObj) {
                    winner.player.hand.push(boardObj.card);
            });
            return
        //return {player:player, pot -> [{player},{card}]}
        } else {
            return {player: bestCardObj.player, pot}
        }
    }


    removeLosers(io) {
        this.playerMap.forEach(function(player) {
            if(player.hand.length === 0) {
                //if true, when next player is called anyone with outOfCards will be skipped
                player.outOfCards = true;
                io.to(this.gameId).emit('playerLost', player)
            }
        });
    }

    winnerCheck(io) {
        let playersWithCards = [];
        console.log('this.playerMap length');
        console.log(this.playerMap.length)
        this.playerMap.forEach(function(player) {
            if(player.hand.length > 0) {
                playersWithCards.push(player);
            }
        });
        console.log(playersWithCards.length)
        if( 0<= playersWithCards.length && playersWithCards.length <= 1){
            this.state = 'gameOver';
            io.to(this.gameId).emit('gameOver', this.getState())
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
            if(data.playCard) {
                let playedCard = false;
                this.cardsOnBoard.forEach(function(card) {
                    if(card.player.socketId == playerId) {
                        playedCard = true;
                    }
                })
                if(! playedCard) {
                    const player = this.playerMap[this.playerTurn];
                    const playedCard =  player.hand.shift();
                    const boardObj = {player:player, card:playedCard};
                    io.to(this.gameId).emit('playedCard', boardObj);
                    this.cardsOnBoard.push(boardObj);
                    this.nextPlayerTurn();
                }
            }
         }
         if(this.cardsOnBoard.length == this.playerMap.length) {
             this.resolveCardsOnBoard(io);

         }



         return this.getState();
    } // End recieveAction

} // End War Class

module.exports = War;
