angular.module("App").directive("colorPicker",["$timeout", function ($timeout) {
	return {
		restrict: 'E',
		replace: true,
		template: 
		'<div class="color-picker">\
			<div class="cp-backdrop"></div>\
			<div class="colors">\
				<button class="{{color}}" ng-repeat="color in colorPicker.colors" data-color="{{color}}"></button>\
			</div>\
		</div>',

		link: function (scope, element, attr) {

			var color = null,
				card = null;

			function saveColor () {
				if(!card || !color) return;
				var id = card.data("id");

				$.ajax({
					url: "app/requests/color.php",
					method: "post",
					data: {nid: id, color: color}
				})
			}

			element.on("cp:toggle", function (e) {
				element.toggle();
			});

			element.find(".cp-backdrop").on("click", () => {
				element.trigger("cp:toggle");

				saveColor();
			});

			$timeout(() => {
				element.find("button").on("click", function (e) {
					var self = $(this);
					color = self.data("color");

					card = element.parents(".card");
					card.removeClass().addClass("card " + color);
				});
			})

			scope.colorPicker = scope.colorPicker || {};
			scope.colorPicker.colors = scope.colorPicker.colors || [
				"alizarin",
				"sun_flower",
				"orange",
				"silver",
				"abestos",
				"emerald",
				"nephritis",
				"green_sea",
				"peter_river",
				"belize_hole",
				"wisteria",
				"amethyst",
				"wet_asphalt",
				"mid_blue"
			];
		}
	}
}]);