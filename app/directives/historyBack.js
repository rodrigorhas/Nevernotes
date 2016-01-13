angular.module("App")
.directive('historyBack', ['$window', function ($window) {
	return {
		link: function (scope, element, attr) {
			element.on("click", function () {
				$window.history.back();
			});
		}
	}
}]);