var app = {

    showAlert: function (message, title) {
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'OK');
        } else {
            alert(title ? (title + ": " + message) : message);
        }
    },

	registerEvents : function (){
		var self = this;
		
		$(window).on('hashchange', $.proxy(this.route, this));
		
		if(document.documentElement.hasOwnProperty('ontouchstart')){
			$('body').on('touchstart','a', function(event){
				$(event.target).addClass('tappable-active');
			});	
			$('body').on('touchend','a', function(event){
				$(event.target).addClass('tappable-active');
			});
		}else{
			$('body').on('mousedown','a', function(event){
				$(event.target).addClass('tappable-active');
			});	
			$('body').on('mouseup','a', function(event){
				$(event.target).addClass('tappable-active');
			});
		}
	},
	QrcodeEvents : function(){
		var self = this;
		console.log('QrCodeEvents');	
		if(!navigator.camera){
			app.showAlert("camera API not supported","error");
			return;
		}else{
			/* BarcodeCheck */
			cordova.plugins.barcodeScanner.scan(
			  function (result) {
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
				  orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
				  disableAnimations : true, // iOS
				  disableSuccessBeep: false // iOS
			  }
		   );
		}
	},
	route : function(){
		var hash = window.location.hash;
		;
		if (!hash){
			$('body').html(new HomeView(this.store).render().el);
			return;
		}else{
			var match = hash.match(app.detailsURL);
			if (match){
				this.store.findById(Number(match[1]),function(employee){
					$('body').html(new EmployeeView(employee).render().el);
				});
			}
		}
	},
	
	slidePage : function(page){
		
		var currentPageDest,
		self = this;
		
		if(!this.currentPage){
			$(page.el).attr('class','page stage-center');
			$('body').append(page.el);
			this.currentPage = page;
			return;
		}
		
		 // Cleaning up: remove old pages that were moved out of the viewport
		$('.stage-right, .stage-left').not('.homePage').remove();
	 
		if (page === app.homePage) {
			// Always apply a Back transition (slide from left) when we go back to the search page
			$(page.el).attr('class', 'page stage-left');
			currentPageDest = "stage-right";
		} else {
			// Forward transition (slide from right)
			$(page.el).attr('class', 'page stage-right');
			currentPageDest = "stage-left";
		}
 
		$('body').append(page.el);
	 
		// Wait until the new page has been added to the DOM...
		setTimeout(function() {
			// Slide out the current page: If new page slides from the right -> slide current page to the left, and vice versa
			$(self.currentPage.el).attr('class', 'page transition ' + currentPageDest);
			// Slide in the new page
			$(page.el).attr('class', 'page stage-center transition');
			self.currentPage = page;
		});
	},
    initialize: function() {
        var self = this;
		this.detailsURL = /^#employees\/(\d{1,})/;
		this.registerEvents();
		this.QrcodeEvents();
        this.store = new MemoryStore(function() {
			self.route();
        });
		
		
	
    }

};

app.initialize();