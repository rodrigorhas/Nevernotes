angular.module("App")
	.controller("starredController", function ($scope, $timeout, store, $routeParams, chunk) {
		$(function () {

			$scope.changeColor = function (e) {
				$(e.target).parents(".card").find(".color-picker").trigger("cp:toggle");
			}

			$scope.removeStar = function (id) {
				$.ajax({
					url: "app/requests/star.php",
					method: "post",
					data: {nid: id, starred: 0},
					success: function () {
						for (var i = 0; i < $scope.starred.length; i++) {
							if($scope.starred[i].id == id)
								$timeout(() => $scope.starred.splice(i, 1));
						};
					}
				});
			}

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

			store.loadData("notes", function () {
	    		$timeout(() => $scope.starred = chunk(store.get("notes"), 4));
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

	        if($routeParams.nid)
	            loadNote($routeParams.nid);
		});
	});