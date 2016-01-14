angular.module("App")
	.factory('chunk', ["$http", "$timeout", function($http, $timeout) {
	return function(arr, size) {
			var result = [],
				group = 0;

			for (var i = 0; i < arr.length; i++) {
				if(group == size) group = 0;
				if(!result[group]) result[group] = [];

				result[group].push(arr[i]);
				group++;
			};

			return result;
		};
}]);