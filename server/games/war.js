//handelMessage(userId, message)

//game logic
    //GameMessage

//deck logic

//addPlayer (userId) socketId?
//{user_id: playerObj}

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
