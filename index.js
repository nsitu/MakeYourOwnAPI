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
// See also https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/
MongoClient.connect(MONGODB_URI, { useUnifiedTopology: true })
.then(client =>{
    
    // you might like to modify these to connect to a different database or collection
    // e.g. you could make your own colleciton in MongoDB and expose it as an API
    const myCollection = client.db("sample_airbnb").collection("listingsAndReviews")

    app.get('/', (req, res) => {
        res.send('This is a basic API to access data from MongoDB, using the AirBNB sample collection. <a href="https://github.com/nsitu/MakeYourOwnAPI#readme">Read the Documentation</a> to learn more.')
    })

    // Let's create a basic endpoint for houses.
    // It will show the first 20 lisitings of the type "House"
    // Express will listen for GET requests at the /houses URL 
    app.get('/houses', (req, res) => { 
        // Filters let us limit the results based on given criteria. 
        // Read more here: https://docs.mongodb.com/compass/current/query/filter/
        let filter = {
            property_type: "House"
        } 
        myCollection.find(filter)
          .limit(20)    /* limit the results to 20 */
          .toArray()
          .then(json => res.send( json ))
          .catch(err => res.send({message:"Error"}) )
    })

    // let's make another endpoint for "large" places
    // i.e. airbnb listings with more than 4 bedrooms
    app.get('/large', (req, res) => { 

        // Note the use of the $gt (greater than) operator here
        // See also: https://docs.mongodb.com/manual/reference/operator/query/ 
        let filter = {
            bedrooms: {$gt: 4}
        }
        // Projections let you choose which fields to include. Read more here:
        // https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/ 
        let options = {
            projection: {name:1, property_type:1, bedrooms:1},
            sort:{name:1}
        }
        myCollection.find(filter, options)
          .limit(20)    /* limit the results to 20 */
          .toArray()
          .then(json => res.send( json ))
          .catch(err => res.send({message:"Error"}) )
    })

    // Let's make a search endpoint 
    // that allows users to provide a search term
    // via query parameter
    app.get('/search', (req, res) => { 
        
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
        // if no limit is provided, set a default
        if (!limit) limit = 5; 

        myCollection.find(filter, options)
          .limit(limit)
          .toArray()
          .then(json => res.send( json ))
          .catch(err => res.send({message:"Error"}) )
    }) 


    // Let's make an endpoint to show a single listing 
    // users can supply an ID as part of the URL itself. 
    // Since we want a detailed view (all the fields) here,
    // we will avoid using a projection. 
    app.get('/listing/:id', (req, res) => { 
         
        let filter = {
            _id: req.params.id
        }  
        myCollection.find(filter)
          .limit(1)
          .toArray()
          .then(json => res.send( json ))
          .catch(err => res.send({message:"Error"}) )
    }) 


    app.listen(PORT, () =>  console.log(`listening on ${PORT}`)  )

})
.catch(console.error)
