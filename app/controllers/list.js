angular.module("App")
	.controller("listController", function ($scope, $timeout, store) {
		$(function () {

			var scrollbar = function (el, color, cursorWidth, step) {
				el.niceScroll({
					cursorcolor: color,
					cursorborder: 0,
					cursorborderradius: 0,
					cursorwidth: cursorWidth,
					bouncescroll: true,
					mousescrollstep: (step) ? step : 40
				});
			};

			//$timeout(() => scrollbar($(".card .card-body"), "rgba(0,0,0,0.3)", "2px"))

			$scope.notes = [];

			var chunk = function(arr, size) {
			   var newArr = [];
			      for (var i=0; i<arr.length; i+=size) {
			          newArr.push(arr.slice(i, i+size));
			      }
			   return newArr;
			};

			store.loadData("notes", function () {
	    		$timeout(() => {
	    			$scope.notes = chunk(store.get("notes"), 2);
	    		});
			});

			var timeout = null;

		    var qs = (function(a) {
		        if (a == "") return {};
		        var b = {};
		        for (var i = 0; i < a.length; ++i)
		        {
		            var p=a[i].split('=', 2);
		            if (p.length == 1)
		                b[p[0]] = "";
		            else
		                b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
		        }
		        return b;
		    })(window.location.search.substr(1).split('&'));

		    function timeNow(){
		        var today = new Date();
		        var h = today.getHours();
		        var m = today.getMinutes();
		        var s = today.getSeconds();
		        h = (h<10) ? "0" + h : h;
		        m = (m<10) ? "0" + m : m;
		        s = (s<10) ? "0" + s : s;
		        return h + ":" + m;
		    }

		    function saveNote(){
		        var noteId = $('input#noteId').val(),
		            title = $('input#title').val(),
		            text = $('div#summernote').summernote("code");

		        $('span#saving').html('Saving draft...');
		        $.ajax({
		            url: 'save.php',
		            method: 'post',
		            data: {
		                id: noteId,
		                title: title,
		                text: text
		            },
		            success: function(a, e, i){
		                var result = JSON.parse(a);
		                if(result.success){
		                    $('span#saving').html('Draft saved at ' + timeNow());
		                    if(result.id){
		                        $('input#noteId').val(result.id);
		                    }
		                    
		                }else{
		                    $('span#saving').html('Could not save draft');
		                }
		            }

		        })
		    }

		    function sendFile(file,editor,welEditable) {
		      data = new FormData();
		      data.append("file", file);
		        $.ajax({
		            url: "saveimage.php",
		            data: data,
		            cache: false,
		            contentType: false,
		            processData: false,
		            type: 'POST',
		            success: function(data){
		            //alert(data);
		              $('#summernote').summernote('editor.insertImage', data);
		             // $('#summernote').summernote('insertNode', data);
		            },
		           error: function(jqXHR, textStatus, errorThrown) {
		             console.log(textStatus+" "+errorThrown);
		           }
		        });
		    }

	        if(qs['nid'])
	            loadNote(qs['nid']);
		});
	});