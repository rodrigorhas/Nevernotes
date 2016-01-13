angular.module("App")
	.directive("compile",["$compile", function ($compile) {
		return {
			link: function (scope, element, attr) {
				element.removeAttr("html");

				element.append($compile(attr.html || "")(scope));
			}
		}
	}]);