var events = require('../dist/event.js')
var jest = require('jest')

// Mock out firebase so we can test.
jest.mock('firebase', () => {
  var firebase = require('firebase-mock')
  var mocksdk = firebase.MockFirebaseSdk()
  return mocksdk
})

test('Check if data is being returned by ticketmaster api', () => {
  var result = events.getTicketmasterEvents(true)
  expect(result).not.toBeNull()
})

// There is currently no way to test gets and queries to Firestore.
