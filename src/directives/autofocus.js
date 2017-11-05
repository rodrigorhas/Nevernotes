angular.module("Nevernotes")
.directive("autofocus",["$timeout", function ($timeout) {
	return {
		restrict: "A",
		link: function (scope, element) {
			$timeout(() => element.focus());
		}
	}
}]);