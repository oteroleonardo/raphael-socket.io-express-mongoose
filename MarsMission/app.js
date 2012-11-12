//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Module dependencies
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

var express = require('express')
  , partials = require('express-partials')
  , http = require('http')
  , fs = require('fs')
  , path = require('path');

// Bootstrap db connection
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

// Load app configuration
var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env];


var app = express();

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Express configuration
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.configure(function(){
  //app.enable('trust proxy'); in case we are behind a reverse proxy such as Varnish or Nginx
  app.set('port', process.env.PORT || 8080);
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  //app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Models
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

var db = mongoose.createConnection(config.db)
  , Instructions = null;

db.on('error', console.error.bind(console, 'connection error:'));
db.on('connected', function(){
  console.log('DB: ' + config.db + ' connected!');

  // Bootstrap models
  var modelsPath = __dirname + '/app/models'
    , modelFiles = fs.readdirSync(modelsPath);

  modelFiles.forEach(function (file) {
    require(modelsPath + '/' + file)
    console.log("Adding model: " + file);
  });


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // DB data initialization: This section is here just to make easier DB initialization, alternatively you could
  // use  JSON file with MongoDB out of the box provided tools for bulk loading
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////

  Instructions = db.model('Instructions');
  Instructions.find({program:1, line:1}, function(err, instrs){
    if(err) throw new Error('There was an error while retrieving instructions from DB');
    if(instrs.length>0){
      console.log('Mars Rover program already loaded in DB');
    } else {
      // Mars Rover routine should be loaded
      console.log('Loading Mars Rover program');
      var program = require('./config/program_1'); // Remember: it isn't necesary to use .json or .js while using require(...) 
      var line = 1;
  
      program.forEach(function(instructionData){
  
        instructionData.line = line++;
        instructionData.program = 1;
        var instruction = new Instructions(instructionData);
  
        instruction.save(function(err){
          if(err){ 
            console.error('There was an error while saving in DB program: ' 
              + instructionData.program +' line: ' + instructionData.line);
          } else {
            console.log('Program: ' + instructionData.program +' line: ' + instructionData.line
              + ' stored OK in DB');
          }
        });

      });
    };
  });
});
 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Controllers
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

var controllersDir = __dirname + '/app/controllers',
    files = fs.readdirSync(controllersDir);

files.forEach(function (file) {
    controller = require(controllersDir + '/' + file);
    console.log("Adding controller: " + file);
    controller.init(app);
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Server
//////////////////////////////////////////////////////////////////////////////////////////////////////////

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Mars mission control listening on port " + app.get('port'));
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// socket.io configuration
//////////////////////////////////////////////////////////////////////////////////////////////////////////

var io = require('socket.io').listen(server);

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 15); 
  io.set('log level', 1);
});



//////////////////////////////////////////////////////////////////////////////////////////////////////////
// client messages handling
//////////////////////////////////////////////////////////////////////////////////////////////////////////


io.sockets.on('connection', function (socket) {
  
  socket.on('set nickname', function (newNickname) {
      socket.set('nickname', newNickname, function () {
        socket.emit('nickname_accepted', newNickname);
      });
  });

  var instructionPointer =0; //Mars Rover program pointer

  socket.on('msg', function (data) {

    socket.get('nickname', function (err, nickname) {
      console.log('Message from ', nickname);
      if('Opportunity'==nickname){
        if('on_location' == data.message_type){
          console.log('Opportunity sent location: (' + data.x + ', ' + data.y + ')');
          if(data.picture) {
            console.log('The following picture has been received with last location: ' + data.picture );
          }

          Instructions.findOne()
            .where('program', 1)
            .where('line').gt(instructionPointer)
            .select({_id:0, program:1, line:1, type:1, path:1, ETA:1})
            .exec(function(err, instructionFromDB){
              if(err) {
                console.log(err);
              } else if(instructionFromDB==null){
                console.log('There\'s no more Program instructions to send');
              } else {
                instructionPointer = instructionFromDB.line;
                console.log('Sending instruction: ' + instructionPointer + ' to Mars Rover');
                var message = { type: instructionFromDB.type};
                if('move' == instructionFromDB.type){
                  message.path= ('M' + data.x + ',' + data.y + instructionFromDB.path);
                  message.ETA= instructionFromDB.ETA;
                }
                socket.emit('new_instruction', message); 
              }
            });
        }
      }
    });

  });

  setTimeout(function () {  
    socket.send('Warn: Mars Rover link wait exceded the 15 seconds!'); 
  }, 15000); 

  socket.on('disconnect', function() {
    console.log('Mars Rover link temporarily disconnected');
  });      
}); 