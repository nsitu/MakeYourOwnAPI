# Make Your Own API
This is a NodeJS app that exposes an API for accessing sample AirBNB listings via MongoDB.  

# Background
You must create a free [MongoDB Atlas](https://www.mongodb.com/atlas/database) Cluster. You must also load the [Sample Datasets](https://docs.atlas.mongodb.com/sample-data/) into your Cluster.  In particular, this example uses the [AirBNB](https://docs.atlas.mongodb.com/sample-data/sample-airbnb/#sample-airbnb-listings-dataset) Sample Dataset. You should also open up access to your cluster in the Security > Network Access > IP Access List. For example, you might add your computer's IP address to the list. Alternately, you can use the catch-all IP: 0.0.0.0/0  to enable access from any machine.  For a visual overview, see the [MongoDB - Getting Started](https://miro.com/app/board/uXjVODOzuOI=/) Miro Board.

# Environment Variables
You should add your MongoDB connection string as an environent variable. For example, it might look something like this: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net`. (Replace "username" and "password" in the connection string with your actual username and password).

# API Endpoints  
This app exposes three API endpoints, each of which has a different purpose:
The `/houses` endpoint returns the first 20 listings that match the property type "House".  
The `/large` endpoint returns the first 20 listings that have more than 4 bedrooms.  
The `/search` endpoint allows you to modify results based on query parameters. (e.g. `search=river` or `limit=50`)

# Working Locally 
If you have NodeJS installed, you can run this app locally. Clone it to a folder of your choosing, and then run:  
`npm install`  
This will add the needed dependencies, as specified in `package.json`. Once you have installed these dependencies, you can run the app with this command:  
`node index.js`  
You should then see `listening on 5000` on your terminal. You can then open your 

# Deployment
You can deploy this code to Heroku fairly easily. The `package.json` includes a `start` script that tells Heroku to automatically run `node index.js`. For Example, you can see test out the endpoints here:  
[https://ixd-airbnb-api.herokuapp.com/houses](https://ixd-airbnb-api.herokuapp.com/houses)
[https://ixd-airbnb-api.herokuapp.com/large](https://ixd-airbnb-api.herokuapp.com/large)
[https://ixd-airbnb-api.herokuapp.com/search?search=river](https://ixd-airbnb-api.herokuapp.com/search?search=river)
