// This will break testing due to mock. It is not needed for our use case
// case so it will cause warnings when documents are added

// This add function will create a new existing object
// in the database or set its data if it already exists.
// Returns true if successful, false otherwise.
function add (collection, id, data, db) {
  if (db == null) {
    return true
  }

  db.collection(collection).doc(id).set(data)
    .then(function (docRef) {
      console.log('Document written with ID: ', id)
      return true
    })
    .catch(function (error) {
      console.error('Error adding document: ', error)
      return false
    })
  return true
}

// Get an entire collection of data.
// Returns an array of the document(s) if successful.
async function getCollection (collection, db) {
  var documents = []
  let prom = await loadToDocuments(documents, db, collection).then(function(result) {
    return new Promise(resolve => {
      resolve(result)
    })
  })
  return prom
  // db.collection(collection).get().then(function (querySnapshot) {
  //   querySnapshot.forEach(function (doc) {
  //     // doc.data() is never undefined for query doc snapshots
  //     documents.push(doc.data())
  //   })
  // })
}

async function loadToDocuments(documents, db, collection) {
  return new Promise((resolve, reject) => {
    db.collection(collection).get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        documents.push(doc.data())
      })
      resolve(documents)
    })
  })
}

// Get a specific document from the collection.
function getDocument (collection, id, db) {
  db.collection(collection).doc(id).get().then(function (doc) {
    if (doc.exists) {
      return doc
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!')
      return false
    }
  }).catch(function (error) {
    console.log('Error getting document:', error)
    return false
  })
}

// Query a collection for a specific set of parameters.
// Returns an array of the document(s) if successful, false otherwise.
function query (collection, params, db) {
  var documents = []
  db.collection(collection).where(params).get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, ' => ', doc.data())
      documents.push(doc)
    })
  })
    .catch(function (error) {
      console.log('Error getting documents: ', error)
      return false
    })
  return documents
}

// Function exports
module.exports.add = add
module.exports.getCollection = getCollection
module.exports.getDocument = getDocument
module.exports.query = query
