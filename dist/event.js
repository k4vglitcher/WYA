var database = require('./database.js')
var ticketmaster = require('ticketmaster')
var tmkey = '0Ob5GZwRU5VBfD3M1iubnPdOa9DjyUIi'

function getTicketmasterEvents (testing) {
  ticketmaster(tmkey).discovery.v2.event.all().then(function (result) {
    if (testing && result.items.length > 0) {
      return true
    }
    var i = 0
    for (i = 0; i < 10 && i < result.items.length; i++) {
      var event = result.items[i]
      var eventdata = {
        'id': event['id'],
        'url': event['url'],
        'images': event['images'],
        'dates': event['dates'],
        'priceRanges': event['priceRanges'],
        'type': 'ticketmaster'
      }
      database.add('events', eventdata['id'], eventdata)
    }
  })
}

module.exports.getTicketmasterEvents = getTicketmasterEvents
