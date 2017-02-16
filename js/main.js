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
        this.store = new MemoryStore(function() {
			self.route();
        });
    }

};

app.initialize();