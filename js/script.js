var app = angular.module('App', ["ngRoute"]);

app.controller("mainController", function ($scope, store) {

	store.$$proxy
		.add("notes", {
			all: 'getNotes.php'
		});

	$scope.route = function (route) {
		window.location.hash = route;
	}

	$(function() {

		var checkComponents = function () {
			/**
			 * Text fields - floating labels
			 */

			if($('.fg-line')[0]) {
				$('body').on('focus', '.fg-line .form-control', function(){
					$(this).closest('.fg-line').addClass('fg-toggled');
				})

				$('body').on('blur', '.form-control', function(){
					var p = $(this).closest('.form-group, .input-group');
					var i = p.find('.form-control').val();

					if (p.hasClass('fg-float')) {
						if (i.length == 0) {
							$(this).closest('.fg-line').removeClass('fg-toggled');
						}
					}
					else {
						$(this).closest('.fg-line').removeClass('fg-toggled');
					}
				});
			}

			//Add blue border for pre-valued fg-flot text feilds
			if($('.fg-float')[0]) {
				$('.fg-float .form-control').each(function(){
					var i = $(this).val();

					if (!i.length == 0) {
						$(this).closest('.fg-line').addClass('fg-toggled');
					}

				});
			}
		}

		/*$scope.$on('$routeChangeSuccess', function(next, current) {
		   checkComponents();
		});*/

		/**
		 * Sidebar jquery functions
		 */

		 $('body').on('click', '#menu-trigger', function(e) {
			e.preventDefault();
			var x = $(this).data('trigger');

			$(x).toggleClass('toggled');
			$(this).toggleClass('open');

			$('.sub-menu.toggled').not('.active').each(function(){
				$(this).removeClass('toggled');
				$(this).find('ul').hide();
			});

			$('.profile-menu .main-menu').hide();

			if (x == '#sidebar') {
				$elem = '#sidebar';
				$elem2 = '#menu-trigger';

				$('#chat-trigger').removeClass('open');

				if (!$('#chat').hasClass('toggled')) {
					$('#header').toggleClass('sidebar-toggled');
				}
				else {
					$('#chat').removeClass('toggled');
				}
			}

			//When clicking outside
			if ($('#header').hasClass('sidebar-toggled')) {
				$(document).on('click', function (e) {

					var closeSideBar = function () {
						setTimeout(function () {
							$($elem).removeClass('toggled');
							$('#header').removeClass('sidebar-toggled');
							$($elem2).removeClass('open');
						});
					}

					if (($(e.target).closest($elem).length === 0) && ($(e.target).closest($elem2).length === 0)) {
						closeSideBar();
					}

					else {
						var target = $(e.target).parent();
						if(target[0].nodeName == "LI" && !target.hasClass("sub-menu")) {
							closeSideBar();
						}
					}
				});
			}
		});

		//Submenu
		$('body').on('click', '.sub-menu > a', function(e){
			e.preventDefault();

			var self = $(this);

			if(!self.parent().hasClass('toggled')){
				$('.sub-menu').removeClass('toggled').find('ul').slideUp(200);
			}

			self.next().slideToggle(200);
			self.parent().toggleClass('toggled');
		});

		/**
		 * Body wrapper option
		 */

		var layoutStatus = localStorage.getItem('mgcp-layout-status');

		if(layoutStatus == null) {

			$('body').addClass('sw-toggled');
			$('#toggle-width #tw-switch').attr("checked", true);
			localStorage.setItem('mgcp-layout-status', 1);
		}

		if (layoutStatus == 1) {
			$('body').addClass('sw-toggled');
			$('#tw-switch, #sideMenuOption').prop('checked', true);
		}

		$('body').on('change', '#toggle-width input:checkbox, .toggle-width input:checkbox', function(){
			if ($(this).is(':checked')) {
				$('body').addClass('toggled sw-toggled');
				localStorage.setItem('mgcp-layout-status', 1);
			}
			else {
				$('body').removeClass('toggled sw-toggled');
				localStorage.setItem('mgcp-layout-status', 0);
			}
		});

		$scope.clearlocalstorage =  function (e) {

			var modal = new Modal({
				header: 'Confirmação',
				body: 'Deseja mesmo excluir <strong>TODAS</strong> as <strong>CONFIGURAÇÕES LOCAIS</strong> ?',
				color: "blue",
				NOYES: true,
				opts: {backdrop: 'static'}, // prevent outsideclick
				handlers: {
					cancel: function () {
						Utils.notify("Confirmação cancelada");
					},

					confirm: function () {
						window.localStorage.clear();
						Utils.notify("Configurações resetadas", "success");
					}
				}
			});

			modal.show();
		};

		/**
		 * Fullscreen snippet
		 */

		 $scope.togglefullscreen = function () {
			if (!document.fullscreenElement &&    // alternative standard method
			!document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
				if (document.documentElement.requestFullscreen) {
					document.documentElement.requestFullscreen();
				} else if (document.documentElement.msRequestFullscreen) {
					document.documentElement.msRequestFullscreen();
				} else if (document.documentElement.mozRequestFullScreen) {
					document.documentElement.mozRequestFullScreen();
				} else if (document.documentElement.webkitRequestFullscreen) {
					document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
				}
			} else {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				}
			}
		}
	});
});