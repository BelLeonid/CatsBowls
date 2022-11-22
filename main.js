// You need to feed 10 cats. There are 3 bowls.
// Each cat takes random time to eat between 100ms-500ms.
// After every time a cat finishes their food, the bowl needs to be cleaned for 200ms.
// Write a program to feed the cats as efficiently as possible.

const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

class Cat {
    constructor(catId) {
        this.catId = catId
        this.isFed = false
        this.isEating = false
    }
    getFeedingTime() {
        let time = 100 + getRandomInt(400)
        console.log("cat " + this.catId + " eats for " + time)
        return time;
    }

    catIsFed() {
        this.isFed = true
        this.isEating = false
    }
    async feedCat(bowl) {
        bowl.setBowlBusy();
        this.isEating = true
        setTimeout(() => {
            feederEmitter.emit('catIsFed', this.catId, bowl.bowlId);
            this.catIsFed()
        }, this.getFeedingTime())
    }
}

class Bowl {
    constructor(bowlId) {
        this.bowlId = bowlId
        this.isBusy = false
    }
    setBowlBusy() {
        this.isBusy = true;
    }
    setBowlCleaned() {
        this.isBusy = false
        console.log("Bowl " + this.bowlId + " is clean")
        feederEmitter.emit('bowlIsFreed', this.bowlId);
    }

    cleanBowl() {
        setTimeout(() => this.setBowlCleaned(), 200)
    }
}

class Feeder {
  constructor(catsNumber, bowlsNumber) {
    this.cats = []
    this.bowls = []
    for (let i = 0; i < catsNumber; i++) {
      this.cats.push(new Cat(i))
    }
    for (let j = 0; j < bowlsNumber; j++) {
      this.bowls.push(new Bowl(j))
    }
  }

   checkForUnfedCats() {
    for (let cat of this.cats) {
      if (!cat.isFed && !cat.isEating) {
        return cat
      }
    }
    return false
  }

   getFreeBowl() {
     for (let bowl of this.bowls) {
      if (!bowl.isBusy) {
        return bowl
      }
    }
    return false
  }
  
   startFeedingCycleFromBowl(freeBowl) {
    let unfedCat = this.checkForUnfedCats()
    if (unfedCat) {
      unfedCat.feedCat(freeBowl)
    } else {
      console.log('No cats waiting to be fed!')
    }
  }

    herdOfCatsCameToEat() {
        for (let bowl of this.bowls) {
            this.startFeedingCycleFromBowl(bowl)
        }
    }
}

let testFeeder = new Feeder(10, 3)

const feederEmitter = new MyEmitter();
feederEmitter.on('catIsFed', (catId, bowlId) => {
    testFeeder.bowls[bowlId].cleanBowl()
    console.log(`Cat ${catId} is fed on bowl ${bowlId}!`);
});
feederEmitter.on('bowlIsFreed', (bowlId) => {
    testFeeder.startFeedingCycleFromBowl(testFeeder.bowls[bowlId])
});

testFeeder.herdOfCatsCameToEat()