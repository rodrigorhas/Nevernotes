angular.module("App", [])
	.controller("Main", function ($scope) {

		var store = "nevernotes-store";

		function loadStore () {
			var s = localStorage.getItem(store);
			if(s && s.length)
				$scope.list = JSON.parse(s);
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

		$scope.addTag = function (tagName) {
			$scope.post.tags.push({id: $scope.post.tags.length + 1, name: tagName})
		}

		$scope.removeTag = function (index) {
			$scope.post.tags.splice(index, 1);
		}

		$scope.addToSearchbar = function ( str ) {

			if(str.indexOf(" ") > -1) str = "\"" + str + "\"";

			str = "#" + str;

			 var terms = $scope.search,
			 	valid = true,
			 	tags = terms.match(/\#'.*?'|\#".*?"|\S+/ig) || [];

			for (var i = 0; i < tags.length; i++) {
			 	var tag = tags[i];
			 	if(tag == str) valid = false;
			 };

			 if(valid) $scope.search = $scope.search + " " + str;
		}

	});