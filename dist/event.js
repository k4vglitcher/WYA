var database = require('./database.js')
var ticketmaster = require('ticketmaster')
const eventbrite = require('node-eventbrite')
var eventbriteAPI
try {
  eventbriteAPI = eventbrite({
    token: 'LNR6WHXUNVLOJX32TB56',
    version: 'v3'
  })
} catch (error) {
  console.log(error.message) // the options are missing, this function throws an error.
}
var tmkey = '0Ob5GZwRU5VBfD3M1iubnPdOa9DjyUIi'

function updateTicketmasterEvents (testing, db) {
  ticketmaster(tmkey).discovery.v2.event.all({geopoint: 'drh5dcg0bsqy', radius: 5, unit: "miles"}).then(function (result) {
    if (testing && result.items.length > 0) {
      return true
    }
    var i = 0
    console.log(result.items.length)
    for (i = 0; i < result.items.length; i++) {
      var event = result.items[i]

      var eventdata = {
        'id': event['id'],
        'url': event['url'],
        'images': event['images'],
        'dates': event['dates'],
        'location': event['_embedded']['venues'][0]['location'],
        'type': 'ticketmaster'
      }
      database.add('events', eventdata['id'], eventdata, db)

    }
  })
}

function updateEventbriteEvents (testing, db) {
  // Search for eventbrite events around Columbia University.
  eventbriteAPI.search({ 'location.address': '116th St & Broadway, New York, NY 10027', 'location.within': '1mi' }, function (error, data) {
    if (error) { console.log(error.message) } else { var eventResponse = data['events'] }
    var i = 0
    for (i = 0; i < eventResponse.length; i++) {
      var res = eventResponse[i]
      var eventdata = {
        'id': res['id'],
        'name': res['name'],
        'url': res['url'],
        'start': res['start'],
        'end': res['end'],
        'images': res['logo'],
        'description': res['description'],
        'venue': res['venue_id'],
        'type': 'eventbrite'
      }
      if (eventdata['id'] != null) {
        database.add('events', eventdata['id'], eventdata, db)
      }
    }
  })
}

function getAllEvents (db) {
  return database.getCollection('events', db)
}

module.exports.updateTicketmasterEvents = updateTicketmasterEvents
module.exports.updateEventbriteEvents = updateEventbriteEvents
module.exports.getAllEvents = getAllEvents
