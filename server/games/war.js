//handelMessage(userId, message)
var deck = require('./deck.js');
class War {
    constructor(gameId, userName, socket_id) {
        this.gameId = gameId;
        player = new Player(userName);
        this.playerMap = [ {socket_id : player} ];
        this.gameState = 'waiting'
        this.playerTurn = null;
        this.deck = new Deck();
    }

    getState() {
        //returns current state of game
    }

    add(userName, socketId) {
        player = new Player(userName);
        this.playerMap.push( {socketId : player} );
    }

    remove(socketId) {
        for(var i=0; i<this.playerMap.length; i++) {
                if(this.playerMap[i].socket_id == socketId) {
                    //code here to clean up any data when a player leaves a game
                    this.playerMap.splice(i, 1);
                    break;
                }
            }
        }
    }

    deal() {
        const numPlayers = playerMap.length;
        for(const i=0; i<=52; i++) {
            const playerIdx = i%numPlayers;
            playeMap[1].getCard(this.deck);
        }
    }

    recieveAction(data) {
        //this is the state machine which will validate if the user and action
        // are acceptable and returns the new states of the ui to all users
        if(this.gameState == 'waiting') {
            if(data.startGame) {
                this.deal();
                this.playerTurn = 0;
                this.gameState = 'playing'
            }
        }
        if(this.gameState == 'playing') {
            if(this.playerTurn == this.playerMap[data
                //gameTurn will be a playerObj
        }

    }

}

class Player {
    constructor(name) {
        this.name = name;
        this.hand = [];
    }
    getCard(deck) {
        this.hand.push(deck.deal());
    }

    discard() {
        this.hand.pop();
    }

}
