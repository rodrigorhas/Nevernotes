function AutoFocus ($timeout) {
	const component = {
		restrict: "A",
		link,
	}

	function link (scope, element) {
		$timeout(() => element.focus());
	}

	return component;
}

export default AutoFocus;