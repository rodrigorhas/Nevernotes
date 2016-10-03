angular.module("App", ['ngStorage'])

	.filter("filterByTags", function () {
		return function (items, tags) {
			if(tags.length)
				return items.filter(function (item, index) {

					var match = false;

					item.tags.forEach(function (tag, tagIndex) {
						tags.forEach(function (searchTag) {
							if(tag.name.indexOf(searchTag.slice(1)) > -1)
								match = true;
						});
					});

					return match;
				});
			else
				return items;
		}
	})

	.run(function ($rootScope, $localStorage) {
		$rootScope.store = $localStorage["nevernotes-store"] || [];
	})

	.controller("Main", function ($rootScope, $scope, $timeout, $localStorage) {

		$scope.store = $rootScope.store;

		// initialize tooltips
		$timeout(function () { $('[data-toggle="tooltip"]').tooltip(); $(".note-list").niceScroll({
			cursorcolor: "#ccc",
			cursorwitdh: '5px',
			cursoropacitymin: 0.1,
			cursoropacitymax: 1
		});})

		$scope.getTags = function (str) {
			return str.match(/\S*#(?:\[[^\]]+\]|\S+)/ig) || [];
		}

		$scope.search = "";

		$scope.post = {
			value: "",
			addingPost: false,
			tags: [],

			tagInput: "",

			onTagInputKeydown: function (e) {
				var key = e.which || e.keyCode;

				if(key == 13) {
					if(this.tagInput) {

						if(this.tagInput.indexOf(" ") > -1) this.tagInput = this.tagInput.replace(/\s+/g, '-');

						this.tags.push({name: this.tagInput});
						this.tagInput = "";
					}
				}
			},

			reset: function () {
				var self = this;

				self.value = "";
				self.tags = [];
			},

			save: function () {

				var self = this;

				if($scope.store) {

					var post = {text: self.value, tags: []};

					if(self.tags)
						post.tags = self.tags;

					$scope.store.push(post);
				}

				self.reset();

				console.log($scope.store);
			}
		}

		$scope.removeTag = function (index) {
			$scope.post.tags.splice(index, 1);
		}

		$scope.addToSearchbar = function ( str ) {

			str = "#" + str;

			 var terms = $scope.search,
			 	valid = true,
			 	tags = $scope.getTags(terms);

			for (var i = 0; i < tags.length; i++) {
			 	var tag = tags[i];
			 	if(tag == str) valid = false;
			 };

			 if(valid) $scope.search = $scope.search + ($scope.search.length ? " " : "") + str;
		}

		$scope.removePost = function (index) {
			$scope.store.splice(index, 1);
		}

	});