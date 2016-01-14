angular.module("App")
	.controller("editController", function ($routeParams) {

		var timeout = null,
			save_treshold = 3000;

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
		            url: 'app/requests/save.php',
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

		function configSummerNote(){
	        $('#summernote').summernote({
	            height: '500',
	            focus: true,
	            callbacks: {
	                onChange: function(e) {
	                    if (timeout !== null) {
	                        clearTimeout(timeout);
	                    }
	                    timeout = setTimeout(function () {
	                        saveNote();
	                    }, save_treshold);
	                },
	                onImageUpload: function(files, editor, welEditable) {
	                    sendFile(files[0],editor,welEditable);
	                },

	                toolbar: [
					    ['mybutton', ['title']]
				  	],

	                buttons: {
	                	title: function (context) {
							var ui = $.summernote.ui;

							var button = ui.button({
								contents: 'Title',
								tooltip: 'Set note title',
								click: function () {
									//context.invoke('editor.insertText', 'hello');
								}
							});

							return button.render();
						}
	                }
	            }
	        });
	    }

	    function sendFile(file,editor,welEditable) {
	      data = new FormData();
	      data.append("file", file);
	        $.ajax({
	            url: "app/requests/saveimage.php",
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

		var nid = $routeParams.nid;

		if(nid) {
			$.ajax({
                url: 'app/requests/load.php',
                method: 'post',
                dataType: "JSON",
                data: {id: nid},
                success: function(response) {
                	console.log('write');
                    $('input#noteId').val(nid);
                    $('input#title').val(response.title);
                    $('div#summernote').html(response.text);

                    configSummerNote();
                }
            })
		}
	});