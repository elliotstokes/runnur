define(["knockout"], function(ko) {


	 return function ViewModel() {
        this.routeLength = ko.observable(5);

        this.routeTypes = ko.observableArray([
            { routeName: 'linear' },
            { routeName: 'circular' }
        ]);

        this.routeType = ko.observable("linear");
    }
	
});