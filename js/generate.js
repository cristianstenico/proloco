const fs = require('fs')
const path = require('path')
const nEvents = 24
const nCards = 70
const resources = ['A', 'B', 'C', 'events']
const operations = ['=', '<', '>']
for (let c = 0; c < nCards; c++) {
  let values = null
  const resource = resources[Math.floor(Math.random() * resources.length)]
  const operation = operations[Math.floor(Math.random() * operations.length)]
  const value = Math.floor(Math.random() * 7) + (resource === 'events' ? 3 : 0);
  ['A', 'B', 'C'].forEach(r => {
    if (resource === r) {
      values = ['A', 'B', 'C']
        .filter(x => x !== r)
        .reduce((acc, x) => {
          acc[x] = Math.floor(Math.random() * (operation === '<' ? 7 : operation === '>' ? 3 : 10)) + 1
          return acc
        }, {}
        )
    }
  })
  if (resource === 'events') {
    values = {
      A: Math.floor(Math.random() * (operation === '<' ? 4 : operation === '>' ? 2 : 7)) + 1,
      B: Math.floor(Math.random() * (operation === '<' ? 4 : operation === '>' ? 2 : 7)) + 1,
      C: Math.floor(Math.random() * (operation === '<' ? 4 : operation === '>' ? 2 : 7)) + 1
    }
  }
  const postEvents = Math.floor(Math.random() * 2) + 1
  const card = {
    name: c,
    up: {
      pre: `${resource} ${operation} ${value}`,
      values
    },
    down: {
      post: {
        events: postEvents
      },
      values: {
        A: Math.floor(Math.random() * 2 * postEvents) + 1,
        B: Math.floor(Math.random() * 2 * postEvents) + 1,
        C: Math.floor(Math.random() * 2 * postEvents) + 1
      }
    }
  }
  fs.writeFileSync(path.join(__dirname, `cards/${c}.json`, JSON.stringify(card)))
}
for (let c = 0; c < nEvents; c++) {
  const eventA = Math.floor(Math.random() * 18) + 1
  const eventB = Math.floor(Math.random() * 18) + 1
  const eventC = (37 + Math.floor(Math.random() * 8) - 4) - eventA - eventB
  const sum = eventA + eventB + eventC
  const people = Math.floor(sum / 7) + Math.floor(Math.random() * 2) - 1
  const card = {
    name: c,
    A: eventA,
    B: eventB,
    C: eventC,
    people
  }
  fs.writeFileSync(path.join(__dirname, `events/${c}.json`), JSON.stringify(card))
}
