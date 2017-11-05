angular.module("App")
.directive("btn", function () {
	return {
		restrict: 'C',
		link: function (scope, element) {
			if(element.is('a')) 
				element.not('.btn-icon, input').addClass('waves-effect waves-button');
			else
				element.not('.btn-icon, input').addClass('waves-effect');

			Waves.displayEffect();
		}
	}
});