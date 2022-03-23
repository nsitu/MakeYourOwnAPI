// import environment variables 
require('dotenv').config()  

const MONGODB_URI = process.env.MONGODB_URI || '' /* Connection String for MongoDB */
const PORT = process.env.PORT || 5000			  /* e.g. 1234 - PORT number */

// MongoDB Driver
const { MongoClient } = require('mongodb') 

// Initialize Express. 
const express = require('express') // include express  
const app = express()

// Cross Origin Resource Sharing
const cors = require ('cors')         
app.use( cors() ); 

// Connect to MongoDB
MongoClient.connect(MONGODB_URI, { useUnifiedTopology: true })
.then(client =>{
    
    // you might like to modify these to connect to a different database or collection
    // e.g. you could make your own colleciton in MongoDB and expose it as an API
    const myCollection = client.db("sample_airbnb").collection("listingsAndReviews")

    app.get('/airbnb', (req, res) => { 
        // Filters let you limit the results based on given criteria. 
        // Read more here: https://docs.mongodb.com/compass/current/query/filter/
        // Note the use of the greater than operator
        // Read more about operators here: https://docs.mongodb.com/manual/reference/operator/query/ 
        let filter = {
            property_type: "House",
            bedrooms: {$gt: 1}
        }
        // Projections let you choose which fields to include. Read more here:
        // https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/ 
        let options = {
            projection: {name:1,property_type:1, bedrooms:1},
            sort:{name:1}
        }
        myCollection.find(filter, options)
          .limit(20)    /* limit the results to 20 */
          .toArray()
          .then(json => res.send( json ))
          .catch(err => res.send({message:"Error"}) )
    })

    app.get('/airbnb/search/', (req, res) => { 
        
        // here we are using the "search" parameter to let users 
        // find listings whose name contains a given string.
        // Read more about Regular expressions here:
        // https://docs.mongodb.com/manual/reference/operator/query/regex/ 
        let filter = {
            name: {$regex: req.query.search} 
        }
        let options = {
            projection: {name:1,property_type:1, bedrooms:1},
            sort:{name:1}
        }

        // here we allow the user to set their own limit via query parameters. 
        let limit = parseInt(req.query.limit)
        if (!limit) limit = 5;

        myCollection.find(filter, options)
          .limit(limit)
          .toArray()
          .then(json => res.send( json ))
          .catch(err => res.send({message:"Error"}) )
    })


    app.listen(PORT, () =>  console.log(`listening on ${PORT}`)  )

})
.catch(console.error)
