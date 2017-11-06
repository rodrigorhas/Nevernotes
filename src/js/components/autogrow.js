angular.module("Nevernotes")
.directive("autoGrow",["$timeout", function ($timeout) {
	return {
		restrict: "A",
		link: function (scope, element) {
			$timeout(() => element.autosize());
		}
	}
}]);