angular.module("App").directive("tagAutocomplete", function ($timeout, $compile) {
	return {
		restrict: 'A',

		link: function (scope, element, attrs, controller) {

			var list = $("#tagAutocomplete-list");

			if(!list.length) {
				list = $('<ul ng-show="checkVisibility()"><li ng-repeat="$key in list"><a href="#" ng-click="selectItem($key)">{{$key.name}}</a></li></ul>')
				.attr('id', "tagAutocomplete-list")
				.css({position: 'absolute'})
				.prepend($('<span ng-if="warn.length"><b><small>{{warn}}</small></b></span>')),

				offset = element.offset();

				console.log(offset, element.parent());

				list.css({left: offset.left, top: offset.top})

				list = $compile(list)(scope);

				list.appendTo('body');
			}
		},

		controller: function ($scope, $element, $attrs) {

			var list = $("#tagAutocomplete-list");

			var defaults = {
				delay: 300
			}

			$scope.state = false;
			$scope.list = [];
			$scope.warn = "";

			$scope.checkVisibility = function () {
				if($scope.list.length) {
					return true;
				}

				else if ($scope.warn.length) return true;

				else return false;
			}

			options = $.extend($attrs, defaults);

			tagPattern = /#(\w*(?:\s*\w*))$/g;

			var resetWarn = function () {
				$timeout(function () { $scope.warn = "" });
			}

			var clearList = function () {
				$timeout(function () { $scope.list = []; });
			}

			var populateList = function (matches) {
				$timeout(function () { $scope.list = matches; resetWarn()})
			}

			var delay = (function(){
				var timer = 0;
				return function(callback, ms){
					clearTimeout (timer);
					timer = setTimeout(callback, ms);
				};
			})();

			var warnUser = function (warn) {
				if(warn) {
					$timeout(function () { $scope.warn = warn; });
				}
			}

			var processMatch = function (match) {

				var matches = $scope.tags.dataset.filter(function (tag) {
					if(tag.name.indexOf(match) == 0) {
						return true;
					}
				});

				if(matches.length) {
					populateList(matches);
					warnUser(false);
				}

				else {
					clearList();
					warnUser('Nenhum resultado para: "' + match + '"');
				}

			}

			var searchByMatches = function (value) {
				var matches = value.match(tagPattern);

				if(matches) {
					match = matches[0];

					if(match.length > 1) {
						// remove # from the string
						processMatch(match.substring(1));
					}

					else {
						console.log(match);
						clearList();
					} 
				}
			}

			function getCaretPosition(ctrl) {
				var start, end;
				if (ctrl.setSelectionRange) {
					start = ctrl.selectionStart;
					end = ctrl.selectionEnd;
				} else if (document.selection && document.selection.createRange) {
					var range = document.selection.createRange();
					start = 0 - range.duplicate().moveStart('character', -100000);
					end = start + range.text.length;
				}
				return {
					start: start,
					end: end
				}
			}

			$scope.selectItem = function (item) {
				var caret = getCaretPosition($element);

				var result = /\S+$/.exec($element.val().slice(0, caret.end));
				var lastWord = result ? result[0] : null;
				alert(lastWord);

				clearList();
			}

			$element.on('keyup', function (e) {
				delay(function () {
					searchByMatches($element.val());
				}, options.delay);
			})
		},

		scope: {
			tags: '='
		}
	}
});