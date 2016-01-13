angular.module("App")
.config(['$routeProvider',
	function($routeProvider,$routeParams) {
	$routeProvider
		.when('/', {
			templateUrl: "templates/list.html",
			controller: "listController"
		})

		.otherwise({
			redirect: "/error-404"
		})
}]);