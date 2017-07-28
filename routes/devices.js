var express = require('express');
var router = express.Router();
var Device = require('../models/Device.js');
var isvalid = require('isvalid');

router.post('/', (req, res, next) => { 
	//as we can receive an array ou single device, need to check if is a single or not
	let arrDevices = req.body.length ? req.body : [];
	if(arrDevices.length == 0)
		arrDevices.push(req.body);

	arrDevices.forEach((item, index) => {
		//for each item, validate the schema
		isvalid(item, {
			serialNumber: { 
				type: String, 
				errors: {
					type: 'serialNumber must be a string.',
				}
			},
			deviceId: { 
				type: String, 
				errors: {
					type: 'deviceId must be a string.',
				}
			},	    
			name: { 
				type: String, 
				errors: {
					type: 'name must be a string.',
				}
			}
		}, function(err, validData) {
			if(err)	{
				err.status = 400;
				return next(err);
			}

			let newDevice = new Device(item);

			newDevice.save(function (err) {
				if (err) return next(err);

				//just to check if is last item, to make the return success
				if(index + 1 == arrDevices.length)
					res.send(JSON.stringify({ success : true }));
			});
		});
	});	
});

router.get('/',(req, res, next) => { 
	Device.find({}, function (err, devices) {
		if (err) return next(err);

		if(devices == null || devices.length == 0)
			return res.send(null); 

		res.send(JSON.stringify({ devices : devices }));
	});
});

router.get('/:id', (req, res, next) => { 
	Device.findById(req.params.id, function (err, device) {
		if (err) return next(err);

		//if device was not found, raise an exception
		if(device == null){
			var err = new Error('Device not found');
			err.status = 404;
			return next(err);
		}

		res.send(JSON.stringify({ device : device }));
	});
});


/*
ROUTES CREATED TO BE ABLE TO TEST Throttling as you dont have access to my mlab account
**** I set Throttling in start at package.json ( Ex. set THROTTLING=1 or THROTTLING=0)
*/

router.post('/disable/:id', function(req, res, next) {
	Device.findById(req.params.id, function (err, device) {
		if (err) return next(err);

		if(device == null){
			var err = new Error('Device not found');
			err.status = 404;
			return next(err);
		}

		device.status = 'BLOCK';
		device.save((errSave) => {
			if(errSave) return next(errSave);

			res.send(JSON.stringify({ success : true }));
		})		
	});
});

router.post('/enable/:id', function(req, res, next) {
	Device.findById(req.params.id, function (err, device) {
		if (err) return next(err);

		if(device == null){
			var err = new Error('Device not found');
			err.status = 404;
			return next(err);
		}

		device.status = 'ENABLED';
		device.save((errSave) => {
			if(errSave) return next(errSave);

			res.send(JSON.stringify({ success : true }));
		})		
	});
});

module.exports = router;
