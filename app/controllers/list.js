angular.module("App")
	.controller("listController", function ($scope, $timeout, store) {
		$(function () {

			$scope.notes = [];

			store.loadData("notes", function () {
	    		$timeout(() => $scope.notes = store.get("notes"));
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

		    function loadNote(nid, callback){
		        if(nid){
		            $.ajax({
		                url: 'load.php',
		                method: 'post',
		                data: {
		                    id: nid
		                },
		                success: function(a, e, i){
		                    var result = JSON.parse(a);

		                    $('input#noteId').val(qs['nid']);
		                    $('input#title').val(result.title);
		                    $('div#summernote').html(result.text);
		                    //$('div#summernote').summernote("code", result.text);
		                    if(callback) callback();
		                }
		            })
		        }
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

		    function configSummerNote(){
		        $('#summernote').summernote({
		            height: '500',
		            callbacks: {
		                onChange: function(e) {
		                    if (timeout !== null) {
		                        clearTimeout(timeout);
		                    }
		                    timeout = setTimeout(function () {
		                        saveNote();
		                    }, 5000);
		                },
		                onImageUpload: function(files, editor, welEditable) {
		                    sendFile(files[0],editor,welEditable);
		                }
		            }
		        });
		    }

		    $(document).ready(function() {

		        if(qs['nid']){
		            loadNote(qs['nid'], function(){
		                configSummerNote();
		            });
		        }else{
		            configSummerNote();
		        }
		    });
	

		});
	});