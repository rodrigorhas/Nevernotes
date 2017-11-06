class MainController {
  constructor($scope, $timeout, $localStorage, $sce, $store) {
    
    $store.load().then(function (db) {
      $log("Store initialized");
    });
    
    // set $scope vars
    $scope.Config = $localStorage['nevernotes-config'];
    $log("Config loaded");
    
    $scope.Store = $localStorage["nevernotes-store"];
    $log("Store loaded");
    
    $scope.Tags = {
      dataset: $localStorage['nevernotes-tags'],
      
      add: function (tags) {
        var self = this;
        
        tags.forEach(function (tag) {
          self.addOne(tag);
        });
      },
      
      addOne: function (tag) {
        var self = this,
        now = Date.now(),
        index;
        
        var exists = function (tag) {
          var e = false;
          for (var i = 0; i < self.dataset.length; i++) {
            var item = self.dataset[i];
            
            if(item.name == tag.name) {
              e = item;
              break
            }
          }
          
          return e;
        }
        
        var res = exists(tag);
        
        if(res) {
          ++res.quantity;
          res.keys.push({timestamp: now});
        }
        
        else {
          self.dataset.push({"name": tag.name, "quantity": 1, time: now, keys: []});
        }
      },
      
      remove: function (name) {
        var self = this;
        
        for (var i = 0; i < self.dataset.length; i++) {
          var item = self.dataset[i];
          if(item.name == name) {
            --item.quantity;
            break;
          }
        }
      },
      
      getTag: function (tag) {
        var self = this;
        return self.dataset[tag];
      },
      
      getDataset: function () {
        var self = this;
        return self.dataset;
      }
    }
    
    $log("Tags loaded");
    
    $log("Getting audio files from fileSystem");
    setAudiosUrl();
    
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
    
    function $log (text) {
      if($scope.Config.debugMode) {
        window.console.log.apply(window.console.log, arguments);
      }
      
      var div = $('<div></div>');
      div.text(JSON.stringify(text));
      
      $('.log').append(div);
    }
    
    function setAudiosUrl () {
      $store.getAll('audio').then(function (data) {
        var getAudio = function (audio) {
          return new Promise (function (resolve, reject) {
            for (var i = 0; i < data.length; i++) {
              if(data[i].name == audio.name){
                var url = URL.createObjectURL(data[i].blob);
                resolve(url);
                return;
                break;
              }
            }
            
            reject();
          });
        }
        
        $scope.Store.forEach(function (item) {
          if(item.audios) {
            item.audios.forEach(function (audio) {
              /*console.log(audio);*/
              getAudio(audio).then(function (url) {
                $timeout(function () {
                  audio.url = url;
                });
              }, function () {
                console.log('error ' + audio.name);
              });
            })
          }
        });
      });
      
      
      $log("Finished loading audio from filesystem");
    }
    
    $scope.getUserMedia = function () {
      return new Promise (function (resolve, reject) {
        navigator.getUserMedia({audio: true}, resolve, function(e) {
          $log("== getUserMedia Error ==");
          $log(e);
        });
      })
    }
    
    function randomHash () {
      return Math.random().toString(36).substring(2);
    }
    
    // initialize tooltips
    $timeout(function () { $('[data-toggle="tooltip"]').tooltip(); })
    
    $scope.getTags = function (str, notice = false) {
      if(!str) return;
      
      let group = str.match(/\((.*?)\)/),
          validSigns = ["&", "|"],
          output = {
            values: [],
            signs: [],
            words: false
          };
      
      var isValidSign = function (item) {
        return $.exists(item, validSigns);
      }
      
      var createObject = function (item) {
        var type = (item[0] == "#" || (item[0] == "!" && item[1] == "#")) ? "tag" : "sign";
        
        if(type == "tag") {
          var tag = {exclude: false};
          
          if(item[0] == "!") {
            tag.exclude = true;
          }
          
          tag.value = (tag.exclude) ? item.substring(2) : item.substring(1);
          
          // for cases like #rodrigo) return an invalid tag
          if(/\W+/.test(tag.value)) {
            return {invalid: true, value: item};
          }
          
          tag.type = type;
          
          return tag;
        }
        
        else if(isValidSign(item)) {
          return {value: item, type: type};
        }
        
        else return {invalid: true, value: item};
      }
      
      if (group) {
        group = group[1];
        
        if(group.length == 0) {
          output.words = "()";
          return notice ? "" : output;
        }
        
        var splited = group.split(/\s+/g);
        
        for (var i = 0; i < splited.length; i++) {
          var item = splited[i];
          
          var object = createObject(item);
          
          if(notice && object.invalid && object.value) {
            return "Termo de pesquisa invalido: " + item;
          }
          
          if(object) {
            if(object.type == "tag") {
              delete object.type;
              output.values.push(object);
            }
            
            else if(object.type == "sign") {
              delete object.type;
              output.signs.push(object);
            }
          }
        }
        
        return (notice) ? "" : output;
      }
      
      else {
        // normal search
        if(str) {
          var tags = str.match(/\S*#(?:\[[^\]]+\]|\S+)/ig);
          if(tags) {
            var invalid = false;
            
            for (var i = 0; i < tags.length; i++) {
              var tag = tags[i]
              var object = createObject(tag);
              output.values.push(object);
              
              if(notice && object.invalid) {
                return "Termo de pesquisa invalido: " + object.value;
              }
            }
            
            return (notice) ? "" : output;
          }
          
          else {
            output.words = str;
            return (!notice) ? output : "";
          }
        }
      }
    }
    
    $scope.post = {
      id: "",
      value: "",
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
      
      getText: function () {
        var self = this;
        
        if(self.value) {
          return self.value
          .replace(/\n/g, "</br>");
        }
      },
      
      save: function () {
        
        var self = this,
        post;
        
        if($scope.Store) {
          
          post = {
            id: self.id || randomHash(),
            text: self.getText(),
            tags: self.tags,
            audios: ($scope.audioMode) ? self.audios : []
          };
          
          $scope.Tags.add(self.tags);
          
          for (var i = 0; i < $scope.Store.length; i++) {
            var item = $scope.Store[i];
            if(item.id == self.id) {
              $scope.Store[i] = post;
              
              if(post.audios.length) {
                setAudiosUrl();
              }
              
              self.reset();
              return;
            }
          }
          
          post.audios.forEach(function (audio) {
            $store.saveAudioFile(audio, audio.blob).then(function () {
              console.log(audio);
              delete audio.url;
              audio.saved = true;
            })
          })
          
          if(post.audios.length) {
            setAudiosUrl();
          }
          
          $scope.Store.unshift(post);
          $log("Note saved");
        }
        
        self.reset();
      },
      
      processInput: function (event) {
        var self = this,
        key = event.which || event.keyCode;
        
        if($scope.Config.enterOption && key == 13) {
          $scope.Config.enterOption = !$scope.Config.enterOption;
          event.preventDefault();
          self.save();
        }
      }
    }
    
    $scope.safeHtml = function (html) {
      return $sce.trustAsHtml(html);
    }
    
    $scope.removeTag = function (index) {
      
      $scope.Tags.remove($scope.post.tags[index].name);
      $scope.post.tags.splice(index, 1);
    }
    
    $scope.addToSearchbar = function ( str ) {
      
      str = "#" + str;
      
      var terms = $scope.search,
      valid = true,
      tags = $scope.getTags(terms).values;
      
      tags.forEach(function (tag) {
        if(tag.value == str.substring(1)) return valid = false;
      });
      
      
      if(valid) $scope.search += ($scope.search.length ? " " : "") + str;
    }
    
    $scope.extractText = function (str) {
      return str
      .replace(/\S*#(?:\[[^\]]+\]|\S+)/g, '')
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
            
            /*console.log($scope.post);*/
          });
          
          $(".easy-post textarea").focus()
          
          // remove todas as classes note-edit antes de adicionar
          // no target
          $(".post").removeClass("note-edit");
          
          // adiciona a classe note-edit no target
          $(self.event.target).parents(".post").addClass("note-edit");
        },
        
        Delete: function () {
          var self = $scope.NoteMenu;
          
          /*self.currentPost.audios.forEach(function (audio) {
            fileSystem.deleteFile(audio.name).then(function () {
              $log('File deleted ' + audio.name);
            }, function (e) {
              $log(e);
            })
          });*/
          
          self.currentPost.tags.forEach(function (tag) {
            $scope.Tags.remove(tag.name);
          })
          
          $scope.Store.splice(self.index, 1);
          
          $log('Note deleted');
        }
      }
    }
    
    $(document).on('click', function (e) {
      var target = $(e.target);
      
      if(!target.closest('.note-menu').length && !target.closest('.note-menu-list').length) {
        $scope.NoteMenu.hide();
      }
    })
    
    $scope.removeAudioFromPostList = function (index) {
      var audio = $scope.post.audios[index];
      
      if(audio.saved) {
        /*fileSystem.deleteFile(audio.name).then(function () {
          $log('File deleted ' + audio.name);
        }, function (e) {
          $log(e);
        })*/
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
        $log("Recording...")
      },
      
      stopRecording: function () {
        var self = this;
        self.recording = false;
        
        self.recorder && self.recorder.stop();
        $log('Stopped recording.');
        
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
          $log('Media stream created.');
        }
        
        $scope.Audio.recorder = new Recorder(input);
        $log('Recorder initialised.');
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
    
    $scope.clearFileSystem = function (ask) {
      return new Promise (function (resolve, reject) {
        ask = (ask == false) ? false : true;
        
        var Do = function () {
          $log('Deleting all media from FileSystem...');
          /*fileSystem.getFolderContents('/').then(function (files) {
            files.forEach(function (file) {
              fileSystem.deleteFile(file.name);
            });
          });*/
          
          resolve();
          $log('FileSystem is now empty');
          alert('Todas as midias foram removidas com sucesso');
        }
        
        if(ask && confirm('Você tem certeza que quer fazer isso?')) Do(); else Do();
      })
    }
    
    window.onload = function init() {
      try {
        // webkit shim
        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
        navigator.getUserMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.mediaDevices.getUserMedia || navigator.msGetUserMedia);
        window.URL = window.URL || window.webkitURL || window.mozURL;
        
        $scope.Audio.context = new AudioContext();
        $log('Audio context set up.');
        $log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
      } catch (e) {
        alert('No web audio support in this browser!');
      }
      
      $scope.getUserMedia().then(function (stream) {
        startUserMedia(stream);
      });
    };
    
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
      /*if(confirm('Você tem certeza que quer fazer isso ?')) {
        
        $log("== RESET STORE ==");
        $log("Clearing FileSystem");
        $scope.clearFileSystem(false).then(function () {
          $log("FileSystem is now empty");
          
          $timeout(function () {
            $localStorage['nevernotes-store'] = [];
            $localStorage['nevernotes-tags'] = null;
            $log("LocalStorage has been reseted");
            alert("Reset concluido, a pagina sera recarregada !");
            window.location.reload();
          })
        })
      }*/
    }
    
    $scope.loadConfig = function () {
      /*fileSystem.getCurrentUsage().then(function (usage) {
        $log("Current browser quota is " + $scope.humanFileSize(usage.quota));
        $log("Current browser used quota is " + $scope.humanFileSize(usage.used));
        
        $scope.Config.quota = usage;
        
        if(usage.quota <= 0) {
          $log("Setting browser quota to 1GB");
          fileSystem.requestQuota(1 * 1024 * 1024).then(function (e) {
            $log(e);
          });
        }
      })*/
    }
    
    $scope.loadConfig();
  }
}

export default MainController;