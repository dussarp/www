var HomeView = function(store){
	
	this.initialize = function(){
		//Div Wrapper
		this.el = $('<div/>');
		$(document).on('keyup','.search-key', this.findByName);
	}
	

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


