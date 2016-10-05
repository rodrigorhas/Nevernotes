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
			enterOption: true,
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
			},

			processInput: function (event) {
				var self = this,
				key = event.which || event.keyCode;

				if(self.enterOption && key == 13) {
					event.preventDefault();
					self.save();
				}
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

		$scope.extractText = function (str) {
			return str
				.replace(/\S*#(?:\[[^\]]+\]|\S+)/g, function () {
					return "";
				})
				.replace('#', '')
				.trim();
		}

		$scope.NoteMenu = {
			menu: $(".note-menu-list"),

			currentPost: null,
			event: null,
			index: null,

			hide: function () {
				var self = this;

				self.menu.css({display: "none"});	
			},

			reset: function () {
				var self = this;

				self.event = null;
				self.currentPost = null;
				self.index = null;
			},

			position: function (event, post, index) {
				var self = this,
				target = $(event.target),
				button = (target.parents('.btn').length) ? target.parents('.btn') : target,
				btnOffset = button.offset();

				self.reset();

				self.event = event;
				self.currentPost = post;
				self.index = index;

				console.log(index);

				self.menu.css({top: btnOffset.top, left: ((btnOffset.left - 225) + 32), display: "block"});
			},

			options: {
				Edit: function () {
					var self = $scope.NoteMenu;

					$scope.post.value = self.currentPost.text;
					$scope.post.tags = self.currentPost.tags;
					$scope.post.id = self.currentPost.id;

					// remove todas as classes note-edit antes de adicionar
					// no target
					$(".post").removeClass("note-edit");

					// adiciona a classe note-edit no target
					$(self.event.target).parents(".post").addClass("note-edit");
				},

				Delete: function () {
					var self = $scope.NoteMenu;

					$scope.store.splice(self.index, 1);
				}
			}
		}

	});