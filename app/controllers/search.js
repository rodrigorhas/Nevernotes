angular.module("App")
	.controller("search", function ($scope) {

		/**
		 * Top search
		 */

		var searchInput = $("#top-search-wrap input"),
			pageHeader = $("#header"),
			searchBar = $("#top-search-wrap"),
			searchResultWrap = $("#search-results"),
			resultsHeader = searchResultWrap.find("h2"),
			searchButton = $('#search-button'),
			closeSearchButton = $('#close-search-button'),
			body = $('body'),
			loader = searchResultWrap.find(".loader");

		$scope.searchResults = [];
		$scope.searchInputValue = "";

		$scope.processInclude = function (category) {
			return 'tmpl-' + category + '';
		}

		var loadingSearch = function (active) {
			if(active) {
				loader.fadeIn(250);
			}

			else {

				loader.fadeOut(250);
			}
		};

		var openSearchResults = function () {
			searchBar.addClass("searching");
			body.addClass("no-overflow");
			searchResultWrap.fadeIn(250);
		}

		var closeSearchResults = function () {
			searchBar.removeClass("searching");
			body.removeClass("no-overflow");
			searchResultWrap.fadeOut(250);
		}

		$scope.closeResults = function () {
			closeSearchButton.trigger("click");
		}

		var searchTiming = {
			delay: 500,
			interval: null,
			minLength: 3
		}

		var searchOldValue = null;

		var searchTerms = function (value) {

			loadingSearch(true);

			var tags = [];

			var q = value.replace(/\B\#\w\w+\b/g, function (word) {
				tags.push(word.substr(1));
				return "";
			}) || null;

			$.ajax({
				url: "modules/busca/index.php",
				data: {q: q, tags: tags},
				method: "POST",
				success: function ( response ) {
					response = JSON.parse(response);

					$scope.noResultsFound = response.noResultsFound || false;
					delete response.noResultsFound;

					$scope.$apply(function () {

						$scope.searchResults = response;
						loadingSearch(false);
					});
				}
			});
		}

		var clearSearchTimeInterval = function () {
			if(searchTiming.interval)
				clearInterval(searchTiming.interval);
		}

		var resetSearchTime = function ( terms ) {

			if(terms.length < searchTiming.minLength) return;
			if(searchOldValue == terms) return;
			if(!searchOldValue) searchOldValue = terms;

			clearSearchTimeInterval();

			searchTiming.interval = setInterval(function () {

				searchTerms(terms);
				clearSearchTimeInterval();

			}, searchTiming.delay);
		}

		searchButton.on('click', function (e) {
			e.preventDefault();

			pageHeader.addClass('search-toggled');
			searchInput.focus();
		});

		closeSearchButton.on('click', function(e) {
			e.preventDefault();

			pageHeader.removeClass('search-toggled');
			searchInput.val("");

			if(searchBar.hasClass("searching")) closeSearchResults();
		});

		searchInput.on("keyup", function (e) {
			var self = $(this),
				value = self.val();

			loadingSearch(false);
			resetSearchTime($scope.searchInputValue);
		});

		searchInput.on("keyup keydown", function (e) {

			var self = $(this),
				value = self.val(),
				key = e.which || e.keyDown;

			if(key == 27) closeSearchButton.trigger("click");

			if(value.length > searchTiming.minLength - 1) {
				if(!searchBar.hasClass("searching")) openSearchResults();
			}

			else if (searchBar.hasClass("searching")) closeSearchResults();

			searchOldValue = value;
		});
	});