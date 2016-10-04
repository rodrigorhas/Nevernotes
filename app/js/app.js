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

	.run(function ($localStorage) {
		if(!$localStorage["nevernotes-store"]) {
			$localStorage["nevernotes-store"] = [];
		}
	})

	.controller("Main", function ($scope, $timeout, $localStorage) {

		$scope.loadStore = function () {
			$scope.store = $localStorage["nevernotes-store"];
		}

		$scope.loadStore();

		function randomHash () {
			return Math.random().toString(36).substring(2);
		}

		// initialize tooltips
		$timeout(function () { $('[data-toggle="tooltip"]').tooltip(); })

		$scope.getTags = function (str) {
			return str.match(/\S*#(?:\[[^\]]+\]|\S+)/ig) || [];
		}

		$scope.search = "";

		$scope.post = {
			id: "",
			value: "",
			addingPost: false,
			tags: [{name: moment().format("L").replace(/\//g, '-')}],

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
				self.tags = [{name: moment().format("L").replace(/\//g, '-')}];
				self.id = "";
			},

			save: function () {

				var self = this;

				if($scope.store) {

					var post = {id: self.id || randomHash(), text: self.value, tags: self.tags || []};

					for (var i = 0; i < $scope.store.length; i++) {
						var item = $scope.store[i];
						if(item.id == self.id) {
							$scope.store[i] = post;
							self.reset();
							$scope.loadStore();
							return;
						}
					}

					$scope.store.push(post);
				}

				self.reset();
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

		$scope.editPost = function (post, event) {
			console.log(post);
			$scope.post.value = post.text;
			$scope.post.tags = post.tags;
			$scope.post.id = post.id;

			$(event.target).parents(".post").addClass("note-edit");
		}

		$scope.extractText = function (str) {
			return str
				.replace(/\S*#(?:\[[^\]]+\]|\S+)/g, function () {
					return "";
				})
				.replace('#', '')
				.trim();
		}

	});