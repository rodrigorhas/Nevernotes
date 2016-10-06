angular.module("App", ['ngStorage', 'fileSystem'])

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

.controller("Main", function ($scope, $timeout, $localStorage, fileSystem, $sce) {

	$scope.debugMode = true;

	$scope.log = function (text) {
		console.log.apply(console, arguments);
		var p = $('<div></div>');
		p.text(JSON.stringify(text));

		$('.log').append(p);
	}

	$scope.loadStore = function () {
		$scope.store = $localStorage["nevernotes-store"];

		$scope.setAudiosUrl();
	}

	$scope.setAudiosUrl = function () {
		$scope.store.forEach(function (item) {
			if(item.audios) {
				item.audios.forEach(function (audio) {
					var audioFile = getAudioFile(audio);
					
					audioFile.then(function (url) {
						audio.url = url;
					})
				});
			}
		});
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
			audios: [],

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

				// reset textarea
				self.value = "";

				// reset tags
				self.tags = [{name: moment().format("L").replace(/\//g, '-')}];

				// reset id
				self.id = "";

				// reset audio
				self.audios = [];

				// reset audioMode
				$scope.audioMode = false;

				// reset photoMode
				$scope.photoMode = false;
			},

			save: function () {

				var self = this;

				if($scope.store) {

					var post = {
						id: self.id || randomHash(),
						text: self.value,
						tags: self.tags,
						audios: self.audios
					};

					for (var i = 0; i < $scope.store.length; i++) {
						var item = $scope.store[i];
						if(item.id == self.id) {
							$scope.store[i] = post;
							self.reset();
							$scope.loadStore();
							return;
						}
					}

					self.audios.forEach(function (audio) {
						saveAudioOnFileSystem(audio, audio.blob);
					})

					$scope.store.push(post);
				}

				$scope.setAudiosUrl();
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

					self.currentPost.audios.forEach(function (audio) {
						fileSystem.deleteFile(audio.name).then(function () {
							$scope.log('File deleted ' + audio.name);
						}, function (e) {
							$scope.log(e);
						})
					});

					$scope.store.splice(self.index, 1);
				}
			}
		}

		$scope.removeAudioFromPostList = function (index) {
			$scope.post.audios.splice(index, 1);
		}

		$scope.Audio = {
			context: null,
			recorder: null
		}

		function startUserMedia(stream) {
			var input = $scope.Audio.context.createMediaStreamSource(stream);
			$scope.log('Media stream created.');

		    // Uncomment if you want the audio to feedback directly
		    //input.connect($scope.Audio.context.destination);
		    //$scope.log('Input connected to audio context destination.');

		    $scope.Audio.recorder = new Recorder(input);
		    $scope.log('Recorder initialised.');
		}

		$scope.startRecording = function (button) {
			$scope.Audio.recorder && $scope.Audio.recorder.record();
			$scope.log('Recording...');
		}

		$scope.stopRecording = function (button) {
			$scope.Audio.recorder && $scope.Audio.recorder.stop();
			$scope.log('Stopped recording.');

		    // create WAV download link using audio data blob
		    createDownloadLink();

		    $scope.Audio.recorder.clear();
		}

		function createDownloadLink() {
			$scope.Audio.recorder && $scope.Audio.recorder.exportWAV(function(blob) {

				var audio = {name: new Date().toISOString() + '.wav'};

				var url = URL.createObjectURL(blob);

				audio.blob = blob;
				audio.url = url;

				$timeout(function () {
					$scope.post.audios.push(audio);
				});
		    });
		}

		function saveAudioOnFileSystem (audio, blob) {

			fileSystem && fileSystem.writeBlob(audio.name, blob).then(function () {}, function (e) {
				console.erorr(e.text);
			});
		}

		$scope.clearFileSystem = function () {
			fileSystem.getFolderContents('/').then(function (files) {
				files.forEach(function (file) {
					fileSystem.deleteFile(file.name);
				})
			})
		}

		fileSystem.getCurrentUsage().then(function (e) {
			$scope.log(e);
			if(e.quota <= 0) {
				fileSystem.requestQuota(200 * 1024 * 1024).then(function (e) {
					$scope.log(e);
				});
			}
		})

		window.onload = function init() {
			try {
		        // webkit shim
		        window.AudioContext = window.AudioContext || window.webkitAudioContext;
		        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
		        window.URL = window.URL || window.webkitURL;

		        $scope.Audio.context = new AudioContext();
		        $scope.log('Audio context set up.');
		        $scope.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
		    } catch (e) {
		    	alert('No web audio support in this browser!');
		    }


		    navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
		    	$scope.log("Um erro ocorreu no getUserMedia");
		    	$scope.log(e);
		    });
		};

		function getAudioFile (file) {
			$scope.log("getting file " +  file.name);

			return fileSystem.getFile('/' + file.name).then(function (e) {
				return  URL.createObjectURL(e);
			}, function (e) {
				console.error(e);
			});
		}

		$scope.safeUrl = function (string) {
			return $sce.trustAsResourceUrl(string);
		}

		$scope.downloadAudio = function (audio) {
			var url = audio.url;
			var filename = audio.name;
	        var link = $('<a>');
	        link
	        	.attr('href', url)
	        	.attr('download', (filename || 'output.wav'));

	        link.click();
		}

});