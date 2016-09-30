'use strict'
var Deck = require('./decks.js');
var Player = require('./player.js')
class War {
    constructor(gameId) {
        this.name = "war";
        this.gameId = gameId;
        this.minPlayers = 2;
        this.maxPlayers = 4;
        this.activePlayers = 0;
        this.warPlayers = 0;
        this.playerMap = [];
        this.state = 'waiting';
        this.Deck = new Deck();
        this.playedCards = [];
        this.pot = []
    }

    // Minimal State for index function
    getMinState(){
      let minState = {};
      minState.gameId = this.gameId;
      minState.name = this.name;
      minState.capacity = [this.playerMap.length, this.maxPlayers];
      minState.host = this.playerMap[0].name;

      return minState;
    }

    getState() {
        let currentState = {};
        currentState.gameId = this.gameId;
        currentState.name = this.name;
        currentState.state = this.state;
        currentState.playerMap = this.playerMap; // playerMap holds players played Cards for UI

        return currentState;
    }

    // Add Player to game instance
    add(userName, userId,socketId) {
        const player = new Player(userName, userId, socketId);
        player.active = true;
        this.activePlayers += 1;
        this.playerMap.push(player);

        return player
    }

    // Remove player from game instance
    // If active, decriment active players
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
        for(let i=1; i<=52; i++) {
            let playerIdx = i%numPlayers;
            this.playerMap[playerIdx].getCard(this.Deck);

        }
    }

    nextPlayerTurn() {
        //helper to always keep player turns bound by numplayers
        const numPlayers = this.playerMap.length;

        this.playerTurn = (this.playerTurn + 1) % numPlayers;
        // console.log('playerTurn')
        // console.log(this.playerTurn)
        //skips players who are out of cards
        if(this.playerMap[this.playerTurn].outOfCards == true) {
            nextPlayerTurn();
        }
    }

    resolvePlayedCards(io) {
        const self = this;
        // logic to find winner of round
            // default value is always beatable
        let cards = [];
        let bestCardArr = [];

        // Evaluate played cards and look for winner
        this.playedCards.forEach(function(cardObj) {

            //if current card is bigger than current winning rank
            if(bestCardArr.length == 0){
                bestCardArr.push(cardObj);
            } else {
                console.log("card Obj", cardObj);
                console.log("best card arr", bestCardArr);
                if(cardObj.card.rank > bestCardArr[0].card.rank) {
                    bestCardArr = [];
                    bestCardArr.push(cardObj);
                }
                //if current card ties current best rank
                else if(cardObj.card.rank == bestCardArr[0].card.rank) {
                    bestCardArr.push(cardObj);
                }
            }
        });

        /// War Condition ///
        if(bestCardArr.length > 1) {
            // put played cards in winners pot and clear playedCards for next round
            bestCardArr.forEach(function(obj) {
                self.playerMap[obj.index].inWar = true;
                self.state = 'war';
            });
            this.playedCards.forEach(function(cardObj){
              self.pot.push(cardObj);
            })
            this.playedCards = [];
            // Emit war message -- Prompt User to click "war" button
            this.warPlayers = bestCardArr.length;
            io.to(this.gameId).emit('updateCurrentGame', this.getState())
        }

        /// Round Won Condition ///
        if(bestCardArr.length == 1) {
          this.playedCards.forEach(function(cardObj) {
            console.log("best card: " ,bestCardArr[0]);
            // give all cards in this.playedCards to winner
            console.log("this.playermap", self.playerMap[0]);
            self.playerMap[bestCardArr[0].index].hand.push(cardObj.card);
            // clear out playedCards from players hand (player.playedCards is for UI)
            self.playerMap[cardObj.index].playedCards = [];
            // reset player for next round
            self.playerMap[cardObj.index].played = false;
            self.playerMap[cardObj.index].inWar = false;

          });
          this.pot.forEach(function(card) {
              self.playerMap[bestCardArr[0].index].hand.push(cardObj.card);
          });
          // Announce winner
          let roundMessage = {winningCard: bestCardArr[0], message: "" }
          io.to(this.gameId).emit('roundComplete', roundMessage);
          // Send out new current Game Condition
          io.to(this.gameId).emit('updateCurrentGame', this.getState());
          // Reset for next round
          this.playedCards = [];
          bestCardArr = [];
          self.state = 'playing';
          this.removeLosers(io);
          this.winnerCheck(io);
        }
    }

    //bestCard = [{player:player, card:card}]
    // goToWar(bestCardObj, pot,  io) {
    //
    //     let cardsOnBoard = []
    //
    //     bestCardObj.forEach(function(boardObj) {
    //         if(boardObj.player.hand.length > 2) {
    //
    //             let card = boardObj.player.hand.shift()
    //             // emit card
    //             pot.push(card);
    //             card = boardObj.player.hand.shift()
    //             // emit card
    //             pot.push(card);
    //             card = boardObj.player.hand.shift()
    //
    //             // emit card
    //             cardsOnBoard.push({'card': card, 'player': boardObj.player});
    //         } else {
    //             boardObj.player.hand.forEach(function(card) {
    //                 pot.push(card);
    //             });
    //         }
    //
    //     });
    //     if(cardsOnBoard > 0) {
    //         this.cardsOnBoard.forEach(function(boardObj) {
    //             if(bestCardObj.length == 0){
    //                 bestCardObj.push(boardObj);
    //             } else {
    //                 // console.log('boardObj');
    //                 // console.log(boardObj);
    //                 // console.log('bestCardObj[0]');
    //                 // console.log(bestCardObj[0]);
    //                 if(boardObj.card.rank > bestCardObj[0].card.rank) {
    //                     bestCardObj = [];
    //                     bestCardObj.push(boardObj);
    //                 }
    //                 else if(boardObj.card.rank == bestCardObj[0].card.rank) {
    //                     bestCardObj.push(boardObj);
    //                 }
    //             }
    //         });
    //     } else {
    //         return {player:null, pot}
    //     }
    //
    //     if(bestCardObj.length > 1) {
    //
    //         //add emit for goto war again!
    //
    //         const winner = this.goToWar(bestCardObj, pot, io)
    //         winner.pot.forEach(function(boardObj) {
    //                 winner.player.hand.push(boardObj.card);
    //         });
    //         return
    //     //return {player:player, pot -> [{player},{card}]}
    //     } else {
    //         return {player: bestCardObj.player, pot}
    //     }
    // }


    removeLosers(io) {
        this.playerMap.forEach(function(player) {
            if(player.hand.length === 0) {
                // Set player to inactive
                player.active = false;
                // Reduce number of active players
                this.activePlayers -= 1;
                io.to(this.gameId).emit('playerLost', player)
                io.to(this.gameId).emit('updateCurrentGame', this.gameState())
            }
        });
    }

    winnerCheck(io) {
        let players = [];
        this.playerMap.forEach(function(player) {
            if(player.hand.length > 0) {
                players.push(player);
            }
        });
        if( 0 <= players.length && players.length <= 1){
            this.state = 'gameOver';
            io.to(this.gameId).emit('playerWon', players[0])
            io.to(this.gameId).emit('updateCurrentGame', this.getState())
        }
    }

    playCard(index, io){

    if(this.state == 'war') {
        this.playedCards.forEach(function(card) {
            if(index != card.index) {
                const playedCard =  player.hand.shift();
                player.playedCards.push(playedCard);
                this.playedCards.push({index: index, card: playedCard});
                player.played = true;
            }

            if (this.playedCards.length === this.warPlayers){
              console.log('round over');
              this.resolvePlayedCards(io);
            }
        });

    } else {
        const player = this.playerMap[index];
        // player.played set to true after a card is played
        if (!player.played){
          const playedCard =  player.hand.shift();
          player.playedCards.push(playedCard);
          this.playedCards.push({index: index, card: playedCard});
          player.played = true;
          io.to(this.gameId).emit('updateCurrentGame', this.getState());
        };
        if (this.playedCards.length === this.activePlayers){
          let self = this;
          setTimeout(function(){
            self.resolvePlayedCards(io);
            }, 1000);
        }
    }
  }


    // Depreciated --  this.state === playing now routes to playCard function
    // recieveAction(playerId, data, io) {
    //     //this is the state machine which will validate if the user and action
    //     // are acceptable and returns the new states of the ui to all users
    //
    //     // data is gameId and (playerMap) index
    //
    //     if(!data){
    //          return this.getState();
    //     }
    //
    //     if(this.state == 'waiting') {
    //         if(data.startGame) {
    //             this.deal();
    //             this.playerTurn = 0;
    //             this.state = 'playing'
    //             //emits data updating peoples games
    //             return this.getState()
    //         }
    //     }
    //     if(this.state == 'playing') {
    //
    //         //grabing out the current players ID
    //         if(data.playCard) {
    //             let playedCard = false;
    //             this.cardsOnBoard.forEach(function(card) {
    //                 if(card.player.socketId == playerId) {
    //                     playedCard = true;
    //                 }
    //             })
    //             if(! playedCard) {
    //                 const player = this.playerMap[this.playerTurn];
    //                 const playedCard =  player.hand.shift();
    //                 const boardObj = {player:player, card:playedCard};
    //                 this.cardsOnBoard.push(boardObj);
    //                 let returnArr = [ boardObj, this.getState() ]
    //                 console.log("played card: ", playedCard)
    //                 player.playedCards.push(playedCard)  //// TEST CODE ////
    //                 console.log("player.playedCards", player.playedCards);
    //                 io.to(this.gameId).emit('playedCard', returnArr);
    //                 this.nextPlayerTurn();
    //             }
    //         }
    //      }
    //      if(this.cardsOnBoard.length == this.playerMap.length) {
    //          this.resolveCardsOnBoard(io);
    //      }
    //
    //      return this.getState();
    // } // End recieveAction

} // End War Class

module.exports = War;
