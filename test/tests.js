var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  

describe('Begin tests', function() {
	var url = 'http://localhost:3000';
	var deviceId = "";
	var someDeviceKey = "";

	before(function(done) {
		let d = new Date();
		let sufix = d.getHours() + d.getMinutes() + d.getSeconds();
		deviceId = "NDTSTSMID0001-" + sufix
		done();
	});

	describe('Devices - Test 1', function() {
		it('should correctly insert a new device: single object', function(done) {

			let body = {
				serialNumber: "SR" + deviceId,
				deviceId: deviceId,
				name: "Device " + deviceId
			};

			request(url)
			.post('/devices')
			.send(body)
			.expect(200)
			.end(function(err,res) {
				if (err) {
					throw err;
				}

				let obj = JSON.parse(res.text);
				assert.equal(obj.success, true);
				done();
			});
		});		
	});		

	describe('Devices - Test 2', function() {
		it('should correctly insert a new device: array object', function(done) {

			let body = [
				{
					serialNumber: "SR" + deviceId + "-1",
					deviceId: deviceId + "-1",
					name: "Device " + deviceId + "-1"
				},
				{
					serialNumber: "SR" + deviceId + "-2",
					deviceId: deviceId + "-2",
					name: "Device " + deviceId + "-2"
				}
			];

			request(url)
			.post('/devices')
			.send(body)
			.expect(200)
			.end(function(err,res) {
				if (err) {
					throw err;
				}

				let obj = JSON.parse(res.text);
				assert.equal(obj.success, true);
				done();
			});
		});
	});		

	describe('Devices - Test 3', function() {
		it('should raise an error 400: payload doesn\'t match with the schema', function(done) {

			let body = {
				serialNumber: "SR" + deviceId,
				deviceId: deviceId,
				name: "Device " + deviceId,
				newProp: "Should not be here"
			};

			request(url)
			.post('/devices')
			.send(body)
			.expect(400)
			.end(function(err,res) {
				if (err) {
					throw err;
				}
				
				done();
			});
		});		
	});	

	describe('Devices - Test 4', function() {
		it('should raise an error 500: when the deviceId is not unique in the database', function(done) {

			let body = {
				serialNumber: "SR" + deviceId,
				deviceId: deviceId,
				name: "Device " + deviceId
			};

			request(url)
			.post('/devices')
			.send(body)
			.expect(500)
			.end(function(err,res) {
				if (err) {
					throw err;
				}
				
				done();
			});
		});
	});

	describe('Devices - Test 5', function() {
		it('should return array of Devices', function(done) {

			request(url)
			.get('/devices')
			.expect(200)
			.end(function(err,res) {
				if (err) {
					throw err;
				}
				
				let obj = JSON.parse(res.text);

				//store the key to use in another test
				someDeviceKey = obj.devices[0]._id;

				assert.equal(true, obj.devices.length > 0);
				done();
			});
		});
	});

	describe('Devices - Test 6', function() {
		it('should return one device object', function(done) {

			request(url)
			.get('/devices/' + someDeviceKey)
			.expect(200)
			.end(function(err,res) {
				if (err) {
					throw err;
				}
				
				let obj = JSON.parse(res.text);
				assert.equal(obj.device._id, someDeviceKey);
				done();
			});
		});
	});

	describe('Devices - Test 7', function() {
		it('should return error 404: device not found', function(done) {

			request(url)
			.get('/devices/597a47b3bb0818101efca690')
			.expect(404)
			.end(function(err,res) {
				if (err) {
					throw err;
				}

				done();
			});
		});
	});

	describe('Devices - Test 8', function() {
		it('should correctly insert a new device with some missing schema property: single object', function(done) {

			let body = {
				serialNumber: "SR" + deviceId + "-01",
				deviceId: deviceId  + "-01",
			};

			request(url)
			.post('/devices')
			.send(body)
			.expect(200)
			.end(function(err,res) {
				if (err) {
					throw err;
				}

				let obj = JSON.parse(res.text);
				assert.equal(obj.success, true);
				done();
			});
		});		
	});	

	describe('Positions - Test 1', function() {
		it('should insert a position to a device', function(done) {

			let body = {
			    latitude: 19.199843,
			    longitude: 129.606578
		  	};

			request(url)
			.post('/positions/' + someDeviceKey)
			.send(body)
			.expect(200)
			.end(function(err,res) {
				if (err) {
					throw err;
				}

				let obj = JSON.parse(res.text);
				assert.equal(obj.success, true);
				done();
			});
		});
	});
});