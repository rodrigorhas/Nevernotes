angular.module("App").directive("tagAutocomplete", function ($timeout, $compile) {
	return {
		restrict: 'A',

		link: function (scope, element, attrs, controller) {

			var list = $("#tagAutocomplete-list");

			if(!list.length) {
				list = $('<ul ng-show="checkVisibility()"><li tabindex="0" ng-repeat="$key in list" ng-click="selectItem($key)"><a href="#">{{$key.name}}</a><span class="label label-default pull-right">{{$key.quantity}}</span></li></ul>')
				.attr('id', "tagAutocomplete-list")
				.css({position: 'absolute'})
				.prepend($('<span ng-if="warn.length"><b><small>{{warn}}</small></b></span>')),

				list = $compile(list)(scope);

				list.appendTo('.searchbar');
			}
		},

		controller: function ($scope, $element, $attrs) {

			function getList () {
				return $("#tagAutocomplete-list");
			}

			var onItemClick = false;

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

			var resetWarn = function () {
				$timeout(function () {
					if($scope.warn)
						$scope.warn = "";
				});
			}

			var clearList = function () {
				$timeout(function () { 
					if($scope.list.length)
						$scope.list = [];
				});
			}

			var hideList = function () {
	    		clearList();
	    		resetWarn();
	    	}

			var populateList = function (matches) {
				$timeout(function () { $scope.list = matches; resetWarn(); })
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
					if(tag.name.indexOf(match) == 0 && tag.quantity) {
						return true;
					}
				});

				if(matches.length) {
					populateList(matches);
					$timeout(function () {
						selectFirstListItem();
					});
					warnUser(false);
				}

				else {
					clearList();
					warnUser('Nenhum resultado para: "' + match + '"');
				}
			}

			var searchByMatches = function (value) {

			    $timeout(function () {

			    	var token = new Cursores().token($element[0]);

			    	// var teststring = "(#a #a) #a (#a)  (#1 #1 | (#- -#a";

			    	//console.log(token);

		    		var firstPrefixCharIsSymbol = /\W/.test(token.prefix[0]);
		    		var secondPrefixCharIsSymbol = /\W/.test(token.prefix[1]);
		    		var lastPrefixCharIsSymbol = /\W/.test(token.prefix[token.prefix.length - 1]);
		    		var lastSuffixCharIsSymbol = /\W/.test(token.suffix[token.suffix.length - 1]);
		    		var hasSuffix = !!token.suffix.length;
		    		var tagHasSymbol = /\W/.test(token.prefix.substring(1));
			    	var isValidTag = token.prefix[0] == "#" && !tagHasSymbol;
			    	var firstPrefixChar = token.prefix[0];
			    	var secondPrefixChar = token.prefix[1];

			    	var test1 = lastPrefixCharIsSymbol;
			    	var test2 = firstPrefixCharIsSymbol && firstPrefixChar != "#" && firstPrefixChar != "(";
			    	var test3 = firstPrefixCharIsSymbol && secondPrefixCharIsSymbol && secondPrefixChar != "#";
			    	var test4 = !/\#\w*/.test(token.prefix) && !/\(#/.test(token.prefix);

			    	///console.log(test1, test2, test3, test4);

		    		if(test1 || test2 || test3 || test4) return hideList();

			    	if(isValidTag) {
			    		var test1 = !hasSuffix && !lastPrefixCharIsSymbol;
			    		var test2 = lastSuffixCharIsSymbol && !lastPrefixCharIsSymbol && token.suffix.length == 1
			    		var test3 = firstPrefixCharIsSymbol && !hasSuffix;

			    		//console.log(test1, test2, test3);

				    	if(test1 || test2 || test3) {
				    		processMatch(token.prefix.slice(1))
				    	}

				    	else hideList()
			    	}

			    	else {
			    		//console.log(token);
			    		var test1 = firstPrefixChar == "#" && !hasSuffix;
			    		var test2 = firstPrefixCharIsSymbol && !hasSuffix;
			    		var test3 = firstPrefixCharIsSymbol && lastSuffixCharIsSymbol && token.prefix.length > 2;

			    		//console.log(test1, test2);

			    		if (test1) {
				    		processMatch(token.prefix.slice(1))
			    		}

			    		else if(test2 || test3) {
				    		processMatch(token.prefix.slice(2))
			    		}

			    		else hideList()
			    	}
				});
			}

			$scope.selectItem = function (item) {
				onItemClick = true;
				var caret = getCaretPosition($element[0]);
				var value = $element.val();
				var result = /\S+$/.exec(value.slice(0, caret.end));
				var lastWord = result ? result[0] : null;
				var removeSymbols = lastWord.length - 1;


				if(lastWord){
					if(lastWord[0] == "(" && lastWord[1] == "#")
						removeSymbols--;

					insertAtCaret($element, item.name.slice(removeSymbols))
				}

				hideList();
			}

			var selectFirstListItem = function () {
				var list = getList();
				$(list.children()[0]).addClass('active');
			}

			var upSelect = function () {
				var list = getList();
				var active = list.find('.active');
				var prevElement = active.prev();
				if(active.length) {
					if(prevElement.length) {
						active.removeClass('active')
						prevElement.addClass('active');
					}
				}

				else selectFirstListItem();
			}

			var downSelect = function () {
				var list = getList();
				var active = list.find('.active');
				var nextElement = active.next();
				if(active.length) {
					if(nextElement.length) {
						active.removeClass('active')
						nextElement.addClass('active');
					}
				}

				else selectFirstListItem();
			}

			var selectActiveListItem = function () {
				var list = getList();
				var active = list.find('.active');

				if(active.length) {
					active.click();
				}
			}

			$element.on('keydown', function (e) {
				var key = e.which || e.keyCode;

				if(key == 38) {
					e.preventDefault();
					upSelect();
				}

				else if(key == 40) {
					e.preventDefault();
					downSelect();
				}

				else if(key == 13) {
					if($scope.list.length) {
						selectActiveListItem();
					}
				}
			})

			$element.on('keyup', function (e) {
				var key = e.which || e.keyCode;
				var invalidKeys = [38, 40, 13];

				if(!$.exists(key, invalidKeys)) {
					delay(function () {
						searchByMatches($element.val());
					}, options.delay);
				}

			});

			$element.on('focus', function () {
				if(!onItemClick) {
					searchByMatches($element.val());
				}

				else onItemClick = false;
			});

			/*$element.on('blur', function () {
				$timeout(function () {
					clearList();
					resetWarn();
				}, 200);
			});*/
		},

		scope: {
			tags: '='
		}
	}
});