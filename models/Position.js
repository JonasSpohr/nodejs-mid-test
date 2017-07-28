var mongoose = require('mongoose');

var PositionSchema = new mongoose.Schema({
  	latitude: Number,
	longitude: Number,
    deviceSN: String
});

module.exports = mongoose.model('Position', PositionSchema);
