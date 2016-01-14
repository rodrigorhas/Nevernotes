angular.module("App")
	.directive("compile",["$compile", function ($compile) {
		return {
			replace: true,

			link: function (scope, element, attr) {

				attr.$observe("html", function () {
					element.removeAttr("html");
				});

				element.append($compile(attr.html || "")(scope));
			}
		}
	}]);