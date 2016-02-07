angular.module("App", [])

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

	.controller("Main", function ($scope) {

		var store = "nevernotes-store";

		function loadStore () {
			var s = localStorage.getItem(store);
			if(s && s.length)
				$scope.list = JSON.parse(s);
		}

		function getTags ( str ) {
			return str.match(/\S*#(?:\[[^\]]+\]|\S+)/ig) || [];
		}

		$scope.getTags = function (terms) {
			return getTags(terms);
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

			save: function () {

				var s = localStorage.getItem(store),
					self = this;

				s = JSON.parse(s);

				if(!s)
					s = [];

				if(s) {
					var post = {text: self.value, tags: []};

					if(self.tags)
						post.tags = self.tags;

					s.push(post);

					s = JSON.stringify(s);
					localStorage.setItem(store, s);
				}

				$scope.post.value = "";
				$scope.post.tags = [];

				loadStore();
			}
		}

		$scope.list = [];
		loadStore();

		$scope.removeTag = function (index) {
			$scope.post.tags.splice(index, 1);
		}

		$scope.addToSearchbar = function ( str ) {

			str = "#" + str;

			 var terms = $scope.search,
			 	valid = true,
			 	tags = getTags(terms);

			for (var i = 0; i < tags.length; i++) {
			 	var tag = tags[i];
			 	if(tag == str) valid = false;
			 };

			 if(valid) $scope.search = $scope.search + ($scope.search.length ? " " : "") + str;
		}

	});