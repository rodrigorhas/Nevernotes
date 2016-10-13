angular.module("App")
.directive("autoGrow",["$timeout", function ($timeout) {
	return {
		restrict: "A",
		link: function (scope, element) {
			$timeout(() => element.autosize());
		}
	}
}])
.directive('contenteditable', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            // view -> model
            elm.bind('blur', function() {
                scope.$apply(function() {
                    ctrl.$setViewValue(elm.html());
                });
            });

            // model -> view
            ctrl.$render = function() {
                elm.html(ctrl.$viewValue);
            };

            // load init value from DOM
            ctrl.$setViewValue(elm.html());
        }
    };
});