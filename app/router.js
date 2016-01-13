angular.module("App")
.config(['$routeProvider',
	function($routeProvider,$routeParams) {
	$routeProvider
		.when('/', {
			templateUrl: "templates/list.html",
			controller: "listController"
		})

		.when('/edit/:nid', {
			templateUrl: "templates/edit.html",
			controller: "editController"
		})

		.otherwise({
			redirect: "/error-404"
		})
}]);