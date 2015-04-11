<p align=right><img style="margin=0" src="https://s3.amazonaws.com/github/ribbons/forkme_right_red_aa0000.png" alt="Fork me at github"/></p> 
#raphael-socket.io-express-mongoose
A demo web app to show [Node.js](http://nodejs.org/), [Raphael.js](http://raphaeljs.com/), [Socket.io](http://socket.io/), [Express.js](http://expressjs.com/), [Mongoose.js](http://mongoosejs.com/) and [MongoDB](http://www.mongodb.org/) integration

MongoDB is required
-------------------
To properly run the web app you need to have MongoDB already installed in your System. The application assumes you are using the default MongoDB port 27017. In case you need to install MongoDB just follow the indications present in [MongoDB installation](http://docs.mongodb.org/manual/installation/) 

Git repository basic usage
--------------------------

To obtain a local copy of the master: 
```
git clone https://github.com/oteroleonardo/raphael-socket.io-express-mongoose.git
cd raphael-socket.io-express-mongoose
cd MarsMission
```

Building the MarsMission web app
--------------------------------

We first need to download project dependencies and then we'll be ready to start it:  
```
npm update
node app.js
```

nodemon to the rescue
---------------------
If you are like me you don't like to restart your node server each time there is a change in the source code and that's when [nodemon](http://github.com/remy/nodemon) comes to the rescue:
```
npm install nodemon -g
```
And then we could start the server as easy like sunday morning:
```
nodemon app.js [APP_PARAMS_HERE]
```

![Mars Map]:(./MarsMission/public/img/mars_opportunity_map_1.png)


