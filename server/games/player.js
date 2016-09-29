'use strict'

class Player {
    constructor(name, userId, socketId) {
        this.name = name;
        this.userId = userId;
        this.hand = [];
        this.outOfCards = false;
        this.socketId = socketId;
    }

    getCard(deck) {
        this.hand.push(deck.deal());
    }

    discard() {
        this.hand.pop();
    }


}
module.exports = Player;
