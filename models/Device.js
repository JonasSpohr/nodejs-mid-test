var mongoose = require('mongoose');

var DeviceSchema = new mongoose.Schema({
	serialNumber: String,
    deviceId: { type : String,  index: true, unique: true },
    name: String,
    status: { type : String, default: 'ENABLED' }
});

module.exports = mongoose.model('Device', DeviceSchema);
