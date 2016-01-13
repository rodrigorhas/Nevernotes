angular.module("App")
	.controller("editController", function ($routeParams) {

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

        

		var nid = $routeParams.nid;

		console.log(nid);

		if(nid) {
			$.ajax({
                url: 'load.php',
                method: 'post',
                dataType: "JSON",
                data: {id: nid},
                success: function(response) {
                	console.log(response);
                    $('input#noteId').val(nid);
                    $('input#title').val(response.title);
                    $('div#summernote').html(response.text);

                    configSummerNote();
                }
            })
		}
	});