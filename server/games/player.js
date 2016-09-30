'use strict'

class Player {
    constructor(name, userId, socketId) {
        this.name = name;
        this.userId = userId;
        this.hand = [];
        this.playedCards = [];
        this.active = false;
        this.played = false;
        this.socketId = socketId;
    }

    getCard(deck) {
        // console.log('deck');
        // console.log(deck);
        let card = deck.deal();
        // console.log('card');
        // console.log(card);
        if(card) {
            this.hand.push(card);
        }
    }

    discard() {
        this.hand.pop();
    }


}
module.exports = Player;
