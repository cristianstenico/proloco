const fs = require('fs')
const nEvents = 9
for (let c = 0; c < 70; c++) {
  const card = {
    name: c,
    up: {
      pre: {
        A: null,
        B: null,
        C: null,
        events: '=-1'
      },
      values: {
        A: 1,
        B: 2,
        C: 3
      }
    },
    down: {
      post: {
        events: 1
      },
      values: {
        A: 3,
        B: 4,
        C: 5
      }
    }
  }
  fs.writeFileSync(`./cards/${c}.json`, JSON.stringify(card))
}

for (let c = 0; c < nEvents; c++) {
  const card = {
    name: c,
    A: 10,
    B: 10,
    C: 10
  }
  fs.writeFileSync(`./events/${c}.json`, JSON.stringify(card))
}
