// Instruction schema
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  
var InstructionSchema = new Schema({
    program: {type : Number}
  , line: {type : Number}
  , type: {type : String}
  , path: {type : String}
  , ETA: {type : Number}
//  , createdAt  : {type : Date, default : Date.now}
});

InstructionSchema.path('program').validate(function (program) {
  return program >0
}, 'Program should be > 0');

InstructionSchema.path('line').validate(function (line) {
  return line >0
}, 'Line should be > 0');



var model = mongoose.model('Instructions', InstructionSchema);
module.exports = model;


