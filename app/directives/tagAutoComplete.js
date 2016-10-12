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

				list = $compile(list)(scope);

				list.appendTo('.searchbar');
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

			var tagPattern = /#(\w*(?:\s*\w*))$/g;

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

				var returnWord = function (text, caretPos) {
					var index = text.indexOf(caretPos);
					var preText = text.substring(0, caretPos);
					if (preText.indexOf(" ") > 0) {
						var words = preText.split(" ");
			            return words[words.length - 1]; //return last word
			        }
			        else {
			        	return preText;
			        }
			    }

			    var currentWord = returnWord(value, getCaretPosition($element[0]).end);

			    var firstMatch = value.match(new RegExp('\\s?' + currentWord + '\\s', 'g'));

			    if(firstMatch && firstMatch.length) {
			    	firstMatch = firstMatch[0].trim();
			    	if(firstMatch.length > 1) {
			    		return processMatch(firstMatch.substring(1));
			    	}
			    }

			    var matches = value.match(tagPattern);

			    console.log(matches);

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

			function insertAtCaret(element, text) {
				if (!element) { return; }

				element = element[0];

				var scrollPos = element.scrollTop;
				var strPos = 0;
				var br = ((element.selectionStart || element.selectionStart == '0') ?
					"ff" : (document.selection ? "ie" : false ) );
				if (br == "ie") {
					element.focus();
					var range = document.selection.createRange();
					range.moveStart ('character', -element.value.length);
					strPos = range.text.length;
				} else if (br == "ff") {
					strPos = element.selectionStart;
				}

				var front = (element.value).substring(0, strPos);
				var back = (element.value).substring(strPos, element.value.length);
				element.value = front + text + back;
				strPos = strPos + text.length;
				if (br == "ie") {
					element.focus();
					var ieRange = document.selection.createRange();
					ieRange.moveStart ('character', -element.value.length);
					ieRange.moveStart ('character', strPos);
					ieRange.moveEnd ('character', 0);
					ieRange.select();
				} else if (br == "ff") {
					element.selectionStart = strPos;
					element.selectionEnd = strPos;
					element.focus();
				}

				element.scrollTop = scrollPos;
			}

			$scope.selectItem = function (item) {
				var caret = getCaretPosition($element[0]);
				var value = $element.val();
				var result = /\S+$/.exec(value.slice(0, caret.end));
				var lastWord = result ? result[0] : null;

				insertAtCaret($element, item.name.slice(lastWord.length - 1))

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