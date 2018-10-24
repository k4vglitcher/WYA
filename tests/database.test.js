var database = require('../dist/database')
var jest = require('jest')

// Mock out firebase so we can test.
jest.mock('firebase', () => {
  var firebase = require('firebase-mock')
  var mocksdk = firebase.MockFirebaseSdk()
  return mocksdk
})

var TEST_COLLECTION = 'collection'
var TEST_ID = 'ID'
var TEST_DATA = {
  test: 'data'
}

test('Return true when a member is successfully added', () => {
  var result = database.add(TEST_COLLECTION, TEST_ID, TEST_DATA)
  expect(result).toBe(true)
})

// There is currently no way to test gets and queries to Firestore.
