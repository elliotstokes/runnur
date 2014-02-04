define(["knockout"], function(ko) {


	 return function ViewModel() {

	 	//length for create routes
        this.routeLength = ko.observable(5);

        //route types for create routes
        this.routeTypes = ko.observableArray([
            { routeName: 'linear' },
            { routeName: 'circular' }
        ]);

        //selected route for create routes
        this.routeType = ko.observable("linear");

        //action types
        this.actionTypes = ko.observableArray([
            { actionName: 'create' },
            { actionName: 'draw' },
            { actionName: 'upload' },
        ]);
        //action type 
        this.actionType = ko.observable("create");
    }
	
});