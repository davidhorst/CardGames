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
        console.log('deck');
        console.log(deck);
        let card = deck.deal();
        console.log('card');
        console.log(card);
        if(card) {
            this.hand.push(card);
        }
    }

    discard() {
        this.hand.pop();
    }


}
module.exports = Player;
