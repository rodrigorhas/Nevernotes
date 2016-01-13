angular.module("App")
	.filter("html", ['$sce', function($sce) {
		console.log($sce);
	return function(htmlCode){
		return $sce.trustAsHtml(htmlCode);
	}
	}]);