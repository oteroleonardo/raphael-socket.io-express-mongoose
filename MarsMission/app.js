//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Module dependencies
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

var express = require('express')
  , partials = require('express-partials')
  , http = require('http')
//  , path = require('path')
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
// Controllers
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

//var ControllersDir = 'app/controllers',
//    files = fs.readdirSync(ControllersDir);
//
//files.forEach(function (file) {
//    var filePath = path.resolve('./', ControllersDir, file),
//    controller = require(filePath);
//    console.log("Adding controller: " + filePath);
//    controller.init(app);
//});

var controllersDir = __dirname + '/app/controllers',
    files = fs.readdirSync(controllersDir);

files.forEach(function (file) {
    controller = require(controllersDir + '/' + file);
    console.log("Adding controller: " + file);
    controller.init(app);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Models
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

//mongoose.connect(config.db);

// Bootstrap models
var modelsPath = __dirname + '/app/models'
  , modelFiles = fs.readdirSync(modelsPath);
modelFiles.forEach(function (file) {
  require(modelsPath + '/' + file)
    console.log("Adding model: " + file);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Server
//////////////////////////////////////////////////////////////////////////////////////////////////////////

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Mars mission control listening on port " + app.get('port'));
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// socket.io integration
//////////////////////////////////////////////////////////////////////////////////////////////////////////

var io = require('socket.io').listen(server);

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 15); 
  io.set('log level', 1);
});

io.sockets.on('connection', function (socket) {
  
  var instruction= [{type:'move', path:'l0.72-0.96l-1.2-0.72l-1.2l-0.48,1.2l0.96,1.2l0.72,0.96', ETA: 7e3}
  , {type:'take_picture'}
  , {type:'move', path:'L240,63.6l0.96-0.96l1.2-0.48l1.2-1.2l1.2-0.24l3.36-2.4l1.44-0.24l1.2,0.96l1.68-0.96l1.2-0.72l3.84,0.24l7.2l5.52,0.72l4.08,0.24l3.84,0.72l2.16,0.48', ETA: 7000}
  , {type:'move', path:'L282,61.2l2.88,2.4l3.6,1.92l5.04,3.12l3.6,2.64', ETA: 9e2}
  , {type:'take_picture'}
  , {type:'move', path:'L298.8,72l-2.16,3.84l1.68l2.16-0.24l1.44,0.96l1.2,1.2l0.48,0.96l1.44,1.2l5.52-1.68l-0.48,1.2l-0.96,0.72l-3.36,1.2l-3.6-0.24l-1.68-1.2l-1.44-1.2l-2.4-1.2l1.44,4.32l0.72,5.76l7.92l0.72,1.68l-0.24,1.44l-2.88,6l-4.32,12.72l-0.72,1.68l-0.24,14.4l-0.48,0.96l1.44l-3.12,0.24l-0.24,2.88l-1.92,8.88l-0.96,5.28l10.08l13.44l-3.36-0.48l-2.64-0.48l3.36,5.04l5.76,10.32l3.84,6.48l1.44,4.08l-2.16,8.4l-3.12,16.8l-0.96,14.16l-0.48,18l-1.68,20.4l-1.44,16.32l0.48,15.6l1.68l2.16,15.6l0.24,3.84l-2.88,6.72l-4.08,8.88l0.24,5.04l-0.96,13.68l5.76l0.72,1.68l0.48,1.92l-0.48,1.2l1.2,1.44l-0.48,0.96l0.96,1.68l-0.48,1.68l2.88l-0.24,2.64l390l0.24,1.44l-0.24,1.2l-0.24,1.68l0.48,2.16l1.2l0.48,0.96l0.24,2.4l1.44l0.24,1.92l-0.48,3.84l2.16l1.68,0.96l-4.48,-2.4l2.88l-1.2,1.44l-0.48,2.16l-1.44,2.88l-2.16,0.24l-2.64,0.72l-1.92,0.24l-2.16-1.68', ETA: 4e3}
  , {type:'terrain_test'}
  , {type:'move', path:'L270,420l-0.48-2.4l-2.16-0.24l-3.12,1.68l-2.64,2.88l-0.24,3.84l0.48,2.88l-1.92,1.44l0.48,1.44l2.88l0.24,3.84l3.36l0.96,1.92l0.48,1.44l0.48,2.16l1.2,0.48 l-0.48,2.4l0.72,4.32l0.96,4.32l0.24,3.12l1.68,3.84l0.48,5.04l5.52l0.96,4.32l1.2,1.68l-0.48,1.2l0.96,3.36l1.44,4.56l0.24,3.6l0.72,5.76l0.96,2.64l2.64,2.4l1.68,2.88l2.88,3.36l1.2,3.84l1.68,2.64l2.64,1.2l0.48,1.92l0.48,4.08l2.64,3.36l-0.24,3.6l2.84l3.36,2.12l4.08,5.76l0.24,5.28l-0.96,2.64l0.48,1.68l0.24,3.6l0.24,2.88l2.88l3.36l0.48,2.16l0.48,4.32l-0.48,3.6l0.24,2.4l0.48,2.4l3.36l2.4l1.44,4.32', ETA: 7e3}
  , {type:'move', path:'L298.8,594l0.96,4.32l1.68,2.16l5.28-2.4l0.72,2.64l0.24,3.84l0.72,1.44l1.92,2.4l1.2,1.92l4.08,6.48l4.32,5.76l5.52,7.2l4.32,4.32l2.4,1.2l1.44,0.96l2.16-0.72l1.44-1.2l2.16-1.44l1.68-2.64l1.92-3.6l0.96-1.68l1.44-0.24l1.92-1.2l-3.12-4.56l1.44-3.12l2.88l2.16,0.96l2.16,0.48l2.88-1.68l-0.24-2.16l3.6,1.2l-1.44l-0.72-2.16l3.12-3.84l2.4,2.88l1.2,2.88l1.68-2.88l2.16,2.16l2.88-0.48l0.96-2.88l4,0,1.081,0.36,-1.058,-1.686l-20.806,0.269,1.542,-3.514,1.542,0.514l-1.984,0.708,3.797,1.356l1.522,0.543,12.923,6.044,-4.923,1.044l-1.2,0.96l-2.64-5.04l-1.68,0.24l-8.64,5.68l-4.92-1.24l-5.16,0.24l-5.36-0.48l-6.72l-2.4,5.04l2.48l0.32l-1.92,5.04l7.84,1.2l-0.72,2.64l-0.96,3.84l-0.48,14.64l7.68,10.08l0.72-2.88l5.04,12.24l3.84,0.48l1.2,0.24l-1.2,3.84l-10.32,6.48l-10.8,5.76l-9.12,15.84l-0.48,10.32l-2.16,6l-1.2,6.72l-6.48,6.96l-3.6,5.52l-3.84,6.24l-0.24,7.92l6.24,5.76', ETA: 3e4}
  , {type:'take_picture'}
//  , {type:'end_of_mission'}
//  , {type:'end_of_mission'}
  ];
  socket.on('set nickname', function (name) {
      socket.set('nickname', name, function () {
        socket.emit('ready');
      });
  });

  var i =0;
  socket.on('msg', function (data) {

    socket.get('nickname', function (err, nickname) {
      console.log('Message from ', nickname);
      if('Opportunity'==nickname){
        if('on_location' == data.message_type){
          console.log('Opportunity sent location: (' + data.x + ', ' + data.y + ')');
          if(data.picture) {
          console.log('The following picture has been received with last location: ' + data.picture );

          }
          if(i<instruction.length){
            console.log('Sending new instruction to Mars Rover');
            var message = { type: instruction[i].type};
            if('move'==instruction[i].type){
              message.path= ('M' + data.x + ',' + data.y + instruction[i].path);
              message.ETA= instruction[i].ETA;
            }
            socket.emit('new_instruction', message); 
              ;
            i++;        
          }
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