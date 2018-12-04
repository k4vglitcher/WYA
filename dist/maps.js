/* eslint-disable */
const { BrowserWindow } = require('electron')
const firebase = require('firebase')


// Initialize Firebase
var config = {
  apiKey: 'AIzaSyBKOGWZtv9h0dLHEhvTWewbvPQsajxa3Kw',
  authDomain: 'wya-electron.firebaseapp.com',
  databaseURL: 'https://wya-electron.firebaseio.com',
  projectId: 'wya-electron',
  storageBucket: 'wya-electron.appspot.com',
  messagingSenderId: '604404649711'
};
firebase.initializeApp(config);

const mapbody = document.querySelector("#mapBody");

getUpdates = function() {
  events = []
  firebase.firestore().collection("events").onSnapshot(function (querySnapshot) {
    querySnapshot.forEach(function(doc) {

      if(doc.data().type == "ticketmaster") {
        var image_url = doc.data().images[0].url
        //Get appropriate picture size
        var pic_sizes = doc.data().images
        for(i = 0; i < pic_sizes.length; i++) {
          if(pic_sizes[i].height < 300 && pic_sizes[i].width < 300) {
            image_url = doc.data().images[i].url
          }
        }

        map.addMarker({
          lat: doc.data().location.latitude,
          lng: doc.data().location.longitude,
          title: doc.data().id,
          infoWindow: {

            content: '<div style=\'float:left\'><img src="'+ image_url +'" style:"width:4px; height:4px"></div><div style:\'float:right; padding: 10px\'><p><b>Public Event: Date:' + doc.data().dates.start.localDate + ' Time: ' + doc.data().dates.start.localTime + ' \
            </b></p><p> Entertainment Company: ' + doc.data().type + '</p> \
            <a href="' + doc.data().url + '">' + doc.data().url + '</a>\
            </div>'
          }
        });
      }
      else {
        //Event is eventbrite, must get lat and lng
        const url = 'https://www.eventbriteapi.com/v3/venues/'
        const token = 'ZRYOY7WSHN4HIU5YNDXQ'

        var venue_id = doc.data().venue

        fetch(url + venue_id + '/?token=' + token)
          .then((resp) => resp.json())
          .then(function(data) {
            map.addMarker({
              lat: data.latitude,
              lng: data.longitude,
              title: data.name,
              infoWindow: {
                content: '<div style=\'float:left\'><img src="'+ doc.data().images.url +'" style:"width:4px; height:4px"></div><div style:\'float:right; \
                padding: 10px\'><p><b>Public Event: Date:' + doc.data().start.local.split('T')[0] + ' Time: ' + doc.data().start.local.split('T')[1] + ' \
                </b></p><p> Entertainment Company: ' + doc.data().type + '</p><p>Event Name: ' + doc.data().name.text +'</p> \
                <a href="' + doc.data().url + '">' + doc.data().url + '</a>\
                </div>'
              }
            });
            document.querySelector('#mapBody').innerText = data.latitude
          })
      }

    })
  })
}

var map = new GMaps({
  div: "#map",
  lat: 40.8075,
  lng: -73.959,
  zoom: 15
});


getUpdates();
