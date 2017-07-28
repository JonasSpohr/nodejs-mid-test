var express = require('express');
var router = express.Router();
var Position = require('../models/Position.js');
var Device = require('../models/Device.js');

router.post('/:deviceId', (req, res, next) => {
	Device.findById(req.params.deviceId, function (err, device) {
		if (err) return next(err);

		//if device was not found, raise an exception
		if(device == null){
			let err = new Error('Device not found');
			err.status = 404;
			return next(err);
		}

		//if THROTTLING feature is enabled we need to check if the device is ENABLED
		if(process.env.THROTTLING == 1 && device.status !== 'ENABLED'){
			let err = new Error('Device is currently blocked');
			err.status = 403;
			return next(err);
		}
		
		//check if we have a single object or an array on req.body
		let arrPositions = req.body.length ? req.body : [];

		//if we have a single object, push to arrPositions
		if(arrPositions.length == 0)
			arrPositions.push(req.body);

		arrPositions.forEach((item, index) => {

			let newPosition = new Position(item);
			newPosition.deviceSN = device.serialNumber;

			newPosition.save(function (err) {
				if (err) return next(err);

				//just to check if is last item, to make the return success
				if(index + 1 == arrPositions.length)
					res.send(JSON.stringify({ success : true }));
			});	
		});
	});
});

module.exports = router;
