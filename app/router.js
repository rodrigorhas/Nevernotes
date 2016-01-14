angular.module("App")
.config(['$routeProvider',
	function($routeProvider,$routeParams) {
	$routeProvider
		.when('/', {
			templateUrl: "templates/list.html",
			controller: "listController"
		})

		.when('/starred', {
			templateUrl: "templates/starred.html",
			controller: "listController"
		})

		.when('/edit/:nid', {
			templateUrl: "templates/edit.html",
			controller: "editController"
		})

		.when('/trash', {
			templateUrl: "templates/trash.html",
			controller: "listController"
		})

		.when('/new', {
			templateUrl: "templates/new.html",
			controller: "newController"
		})

		.otherwise({
			redirect: "/error-404"
		})
}]);