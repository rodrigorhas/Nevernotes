angular.module("App", ['ngStorage', 'fileSystem', 'ngTouch'])

.filter("filterByTags", function () {
	return function (items, output) {
		if(output.values && output.values.length > 1) {
			output.values = output.values.chunk(2);
			return items.filter(function (item) {
				var match = false;

				if(output.signs.length) {
					output.signs.forEach(function (sign, index) {
						var isEven = (index % 2) == 0;
						var value1 = (isEven) ? output.values[index][0] : output.values[index][1],
							value2 = (isEven) ? output.values[index][1] : output.values[index+1][0];

						switch (sign.value){
							case "&":
								if(value1 && value2) {
									console.log(value1, value2);

									var signMatch = false;

									if(value1.exclude) {
										
									}
								}
								else {
									console.log('case &:', value1, value2, output.values);
								}
							break;

							case "|":
								console.log('|', sign, groupOfValues);
							break;
						}

					});
				}

				return match;
			});
		}

		else return items;
	}

	/*return function (items, tags) {
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
	}*/
})

.run(function ($localStorage) {
	if(!$localStorage["nevernotes-store"]) {
		$localStorage["nevernotes-store"] = [];
	}
})

.controller("Main", function ($scope, $timeout, $localStorage, fileSystem, $sce) {

	Array.range = function(n) {
	  // Array.range(5) --> [0,1,2,3,4]
	  return Array.apply(null,Array(n)).map((x,i) => i)
	};

	Object.defineProperty(Array.prototype, 'chunk', {
	  value: function(n) {

	    // ACTUAL CODE FOR CHUNKING ARRAY:
	    return Array.range(Math.ceil(this.length/n)).map((x,i) => this.slice(i*n,i*n+n));

	  }
	});

	$.exists = function(item, array) { return !!~$.inArray(item, array); };

	$scope.config = {
		debugMode: false,
		quota: {}
	}

	$scope.log = function (text) {
		if($scope.config.debugMode) {
			window.console.log.apply(window.console.log, arguments);
		}

		var div = $('<div></div>');
		div.text(JSON.stringify(text));

		$('.log').append(div);
	}

	$scope.loadStore = function () {
		$scope.log("Store loaded");
		$scope.store = $localStorage["nevernotes-store"];

		$scope.log("Getting audio files from fileSystem")
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
				})
			}
		});

		$scope.log("Finished loading audio from filesystem");
	}

	$scope.getUserMedia = function () {
		return new Promise (function (resolve, reject) {
			navigator.getUserMedia({audio: true}, resolve, function(e) {
				$scope.log("== getUserMedia Error ==");
				$scope.log(e);
			});
		})
	}

	function randomHash () {
		return Math.random().toString(36).substring(2);
	}

	// initialize tooltips
	$timeout(function () { $('[data-toggle="tooltip"]').tooltip(); })

	$timeout(function () { $scope.search = "(#urgente && #concluido)"; })

	$scope.getTags = function (str) {
		var group = str.match(/\((.*?)\)/);
		var validSigns = ["&", "&&", "|", "||"];

		if(group) {
			group = group[1];

			if(group.length == 0) return [];

			var splited = group.split(/\s+/g);

			var output = {
				values: [],
				signs: []
			}

			var processed = splited.forEach(function (item) {
				var type = (item[0] == "#" || (item[0] == "!" && item[1] == "#")) ? "tag" : "signal";

				if(type == "tag") {
					var tag = {exclude: false};

					if(item[0] == "!") tag.exclude = true;
					tag.value = (tag.exclude) ? item.substring(2) : item.substring(1);
					tag.type = type;

					output.values.push(tag);
				}

				else {
					if($.exists(item.trim(), validSigns)) {
						if(item == "&&") item = "&";
						if(item == "||") item = "|";

						output.signs.push({value: item, type: type});
					}
				}
			});

			return output;
		}

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

			var self = this,
			post;

			if($scope.store) {

				post = {
					id: self.id || randomHash(),
					text: self.value,
					tags: self.tags,
					audios: ($scope.audioMode) ? self.audios : []
				};

				console.log(post.audios);

				for (var i = 0; i < $scope.store.length; i++) {
					var item = $scope.store[i];
					if(item.id == self.id) {
						$scope.store[i] = post;
						if(post.audios.length) {
							$scope.setAudiosUrl();
						}
						self.reset();
						return;
					}
				}

				post.audios.forEach(function (audio) {
					saveAudioOnFileSystem(audio, audio.blob).then(function () {
						audio.saved = true;
					})
				})

				if(post.audios.length) {
					$scope.setAudiosUrl();
				}

				$scope.store.push(post);
				$scope.log("Note saved");
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

			self.menu.css({top: btnOffset.top, left: ((btnOffset.left - 225) + 32), display: "block"});
		},

		options: {
			Edit: function () {
				var self = $scope.NoteMenu;

				$timeout(function () {
					$scope.post.value = self.currentPost.text;
					$scope.post.tags = self.currentPost.tags;
					$scope.post.id = self.currentPost.id;
					$scope.post.audios = self.currentPost.audios;

					if(self.currentPost.audios.length){
						$scope.audioMode = true;
					}
				});

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

				$scope.log('Note deleted');
			}
		}
	}

	$scope.removeAudioFromPostList = function (index) {
		var audio = $scope.post.audios[index];

		if(audio.saved) {
			fileSystem.deleteFile(audio.name).then(function () {
				$scope.log('File deleted ' + audio.name);
			}, function (e) {
				$scope.log(e);
			})
		}

		else {

			$scope.post.audios.splice(index, 1);
		}
	}

	$scope.Audio = {
		context: null,
		recorder: null,
		recording: false,

		record: function () {
			var self = this;

			if(!self.recording) {
				self.startRecording();
			}

			else {
				self.stopRecording();
			}
		},

		startRecording: function (event) {
			event && event.preventDefault();
			var self = this;

			self.recorder && self.recorder.record();
			self.recording = true;
			$scope.log("Recording...")
		},

		stopRecording: function () {
			var self = this;
			self.recording = false;

			self.recorder && self.recorder.stop();
			$scope.log('Stopped recording.');

		    // create WAV download link using audio data blob
		    createDownloadLink();

		    self.recorder && self.recorder.clear();
		}
	}

	function startUserMedia(stream) {

		if(!$scope.Audio.recorder) {

			var input;

			if($scope.Audio.context) {
				input = $scope.Audio.context.createMediaStreamSource(stream);
				$scope.log('Media stream created.');
			}

			$scope.Audio.recorder = new Recorder(input);
			$scope.log('Recorder initialised.');
		}
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
		return new Promise (function (resolve, reject) {
			fileSystem && fileSystem.writeBlob(audio.name, blob).then(resolve, function (e) {
				$scope.log('[ Error ] ' + e.text);
			});
		})

	}

	$scope.clearFileSystem = function (ask) {
		return new Promise (function (resolve, reject) {
			ask = (ask == false) ? false : true;

			var Do = function () {
				$scope.log('Deleting all media from FileSystem...');
				fileSystem.getFolderContents('/').then(function (files) {
					files.forEach(function (file) {
						fileSystem.deleteFile(file.name);
					});
				});

				resolve();
				$scope.log('FileSystem is now empty');
				alert('Todas as midias foram removidas com sucesso');
			}

			if(ask && confirm('Você tem certeza que quer fazer isso ?')) Do(); else Do();
		})
	}

	fileSystem.getCurrentUsage().then(function (usage) {
		$scope.log("Current browser quota is " + $scope.humanFileSize(usage.quota));
		$scope.log("Current browser used quota is " + $scope.humanFileSize(usage.used));

		$scope.config.quota = usage;

		if(usage.quota <= 0) {
			$scope.log("Setting browser quota to 1GB");
			fileSystem.requestQuota(10 * 1024 * 1024).then(function (e) {
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

	    $scope.getUserMedia().then(function (stream) {
	    	startUserMedia(stream);
	    });
	};

	function getAudioFile (file) {
		$scope.log("Getting file " +  file.name + ' from FileSystem');

		return fileSystem.getFile('/' + file.name).then(function (e) {
			$scope.log("File " + file.name + " was found");
			return  URL.createObjectURL(e);
		}, function (e) {
			console.log(e);
			$scope.log('[ Error ] ' + e.obj.message);
			$scope.log('[ Error ] File '+ file.name +' was not found on FileSystem');
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

	$scope.humanFileSize = function (bytes, si) {
		var thresh = si ? 1000 : 1024;

		if(Math.abs(bytes) < thresh) {
			return bytes + ' B';
		}

		var units = si
		? ['kB','MB','GB','TB','PB','EB','ZB','YB']
		: ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];

		var u = -1;

		do {
			bytes /= thresh;
			++u;
		} while(Math.abs(bytes) >= thresh && u < units.length - 1);

		return bytes.toFixed(1) + ' ' + units[u];
	}

	$scope.resetStore = function () {
		if(confirm('Você tem certeza que quer fazer isso ?')) {

			$scope.log("== RESET STORE ==");
			$scope.log("Clearing FileSystem");
			$scope.clearFileSystem(false).then(function () {
				$scope.log("FileSystem is now empty");

				$timeout(function () {
					$localStorage['nevernotes-store'] = [];
					$scope.log("LocalStorage has been reseted");
					alert("Reset concluido, a pagina sera recarregada !");
					window.location.reload();
				})
			})
		}
	}

	$scope.loadStore();

});