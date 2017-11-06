function ButtonClass () {
	const component = {
		restrict: 'C',
		link,
	}

	function link (scope, element) {
		if (element.is('a')) 
			element.not('.btn-icon, input').addClass('waves-effect waves-button');
		else
			element.not('.btn-icon, input').addClass('waves-effect');

		Waves.displayEffect();
	}

	return component;
}

export default ButtonClass;