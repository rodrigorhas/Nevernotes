function Icon () {
	const component = {
		restrict: 'E',
		replace: true,

		template: '<i class="zmdi zmdi-{{name}}"></i>',

		scope: {
			name: '@'
		}
	}

	return component;
}

export default Icon;