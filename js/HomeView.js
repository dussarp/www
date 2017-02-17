var HomeView = function(store){
	
	this.initialize = function(){
		//Div Wrapper
		this.el = $('<div/>');
		$(document).on('keyup','.search-key', this.findByName);
		this.el.on('click','.qrcode', this.QrcodeEvents);
	}

	this.QrcodeEvents = function(event){
		event.preventDefault();
		var self = this;
		console.log('QrCodeEvents');	
		if(!navigator.camera){
			app.showAlert("camera API not supported","error");
			return;
		}else{
			/* BarcodeCheck */
			cordova.plugins.barcodeScanner.scan(
			  function (result) {
				  
				  $('.QRinfo', this.el).show().append(result.text);
				  alert("We got a barcode\n" +
						"Result: " + result.text + "\n" +
						"Format: " + result.format + "\n" +
						"Cancelled: " + result.cancelled);
			  },
			  function (error) {
				  alert("Scanning failed: " + error);
			  },
			  {
				  preferFrontCamera : true, // iOS and Android
				  showFlipCameraButton : true, // iOS and Android
				  showTorchButton : true, // iOS and Android
				  torchOn: true, // Android, launch with the torch switched on (if available)
				  prompt : "Place a barcode inside the scan area", // Android
				  resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
				  formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
				  orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
				  disableAnimations : true, // iOS
				  disableSuccessBeep: false // iOS
			  }
		   );
		}
	},
	
	this.render = function() {
       this.el.html(HomeView.homeTpl());
	   return this;
    };
	
	
    this.findByName = function() {
        store.findByName($('.search-key').val(), function(employees) {
            $('.employee-list').html(HomeView.employeeLiTpl(employees));
        });
    };
	
	this.initialize();
	
}

HomeView.homeTpl = Handlebars.compile($("#home-tpl").html());
HomeView.employeeLiTpl = Handlebars.compile($("#employee-li-tpl").html());


