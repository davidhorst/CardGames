'use strict';

class Deck {
    constructor(){
        this.ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10",
                        "J", "Q", "K"];
        this.makeDeck();
    }

    makeDeck() {

        var suits = ["Clubs", "Diamonds", "Hears", "Spades"];
        this.deck = [];

        var i, j;
        for (i = 0; i < suits.length; i++) {
            for (j = 0; j < this.ranks.length; j++) {
                this.deck[i*this.ranks.length + j] = {rank: this.ranks[j], suit: suits[i], imageURI: `${this.ranks[j]} + ${suits[i]}`, name: `${this.ranks[j]} of ${suits[i]} `};
            }
        }
    }

    shuffle() {
        for(var i in this.deck) {
            var tempCard = this.deck[i];
            var randIndex = Math.floor(Math.random()*52+1);
            this.deck[i] = this.deck[randIndex];
            this.deck[randIndex] = tempCard;
        }
    }

    reset() {
        this.makeDeck();
    }

    deal() {
        return this.deck.pop();
    }
}


module.exports = new Deck();
