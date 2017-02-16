var EmployeeView = function(employee){
	
	this.initialize = function (){
		this.el = $('<div />');
		this.el.on('click','.add-location-btn', this.addLocation);
		this.el.on('click','.add-contact-btn', this.addContact);
		this.el.on('click','.pic-contact-btn', this.changePicContact);
	};
	
	this.render = function (){
		this.el.html(EmployeeView.template(employee));
		return this;
	};
	
	this.addLocation = function(event){
		event.preventDefault();
		console.log('addLocation');	
		navigator.geolocation.getCurrentPosition(
			function(position){
				$('.location', this.el).html(position.coords.latitude + ' , ' + position.coords.longitude);
			},
			function(){
				alert('error retrieving location');
			});
		return false;
	};
	
	this.addContact = function(event){
		event.preventDefault();
		console.log('addContact');
		
		if(!navigator.contacts){
			app.showAlert("contacts API not supported","error");
			return;
		}
		
		var contact = navigator.contacts.create();
		contact.name = {givenName: employee.firstName, familityName: employee.lastName};
		var phoneNumbers = [];
		phoneNumbers[0] = new ContactField('work', employee.officePhone, false);
		phoneNumbers[1] = new ContactField('mobile', employee.cellPhone, true);
		contact.phoneNumbers = phoneNumbers;
		contact.save();
		return false;
			
	};
	
	this.changePicContact = function(event){
		event.preventDefault();
		console.log('changePicContact');
		
		if(!navigator.camera){
			app.showAlert("camera API not supported","error");
			return;
		}
		
		var options = {	quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: 1,
						encodingType: 0
			
		};
		
		navigator.camera.getPicture(
			function(imageData){
				$('.employee-img', this.el).attr('src',"data:image/jpeg;base64," + imageData);
			},
			function(){
				app.showAlert('Error Pic','Error');
			},
			options);
		return false;
	};
	
	
	this.initialize();
}

EmployeeView.template = Handlebars.compile($("#employee-tpl").html());



