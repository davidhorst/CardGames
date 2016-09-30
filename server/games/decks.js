'use strict';

class Deck {
    constructor(){
        this.ranks = [2, 3];
        // this.ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10,11, 12, 13,14];
        this.makeDeck();
    }

    makeDeck() {

        var suits = ["clubs", "diamonds", "hearts", "spades"];
        this.deck = [];

        var i, j;
        let x = 0;
        for (i = 0; i < suits.length; i++) {
            for (j = 0; j < this.ranks.length; j++) {
                this.deck[i*this.ranks.length + j] = {rank: this.ranks[j], suit: suits[i], imageURI: `${this.ranks[j]}_of_${suits[i]}`, name: `${this.ranks[j]} of ${suits[i]} `, cardId: x };
                x +=1;
            }
        }
    }

    shuffle() {
        for(var i in this.deck) {
            var tempCard = this.deck[i];
            var randIndex = Math.floor(Math.random()*this.deck.length+1);
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


module.exports = Deck;
