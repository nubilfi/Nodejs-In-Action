/**
 * MongoDB node example
 * install: npm install --save mongodb
 */

const mongo = require('mongodb');
const server = new mongo.Server('localhost', 27017, {});

const client = new mongo.Db('games', server, {w: 1});

// accessing a mongodb collection
client.open((err) => {
    if (err) throw err;
    client.collection('genre', (err, collection) => {
        if (err) throw err;
        console.log('We are now able to perform queries');      // put mongodb query code here
    });

    // inserting a document into a collection
    collection.insert(
        {
            "genre": "Race",
            "title": "Asphalt"
        },
        {safe: true},                   // safe mode indicates database operation should be completed before callback is executed
        (err, documents) => {
            if (err) throw err;
            console.log('Document ID is: ' + documents[0]._id);
        }
    );

    // updating a mongodb document
    const _id = new client.bson_serializer.ObjectID('58d3d5b6a6488dd1d67b95a5');
    collection.update(
        { _id: _id },
        { $set: { "title": "Asphalt 2" }},
        { safe: true },
        (err) => {
            if (err) throw err;
        }
    );

    // seraching for documents
    collection.find({ "genre": "Race"}).toArray(        // display all items with genre 'race'
        (err, results) => {
            if (err) throw err;
            console.log(results);
        }
    );

    // deleting documents
    const _idnew client.
                .bson_serializer
                .ObjectID('58d3d5b6a6488dd1d67b95a5');
    collection.remove({ _id: _id}, {safe: true}, (err) => {
        if (err) throw err;
    });
});

client.close();             // close mongodb connection
