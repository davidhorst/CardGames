'use strict'

class Player {
    constructor(name) {
        this.name = name;
        this.hand = [];
        this.outOfCards = false;
    }
    getCard(deck) {
        this.hand.push(deck.deal());
    }

    discard() {
        this.hand.pop();
    }


}
module.exports = Player;
