function AutoGrow ($timeout) {
	const component = {
		restrict: "A",
		link,
	}

	function link (scope, element) {
		$timeout(() => element.autosize());
	}

	return component;
}

export default AutoGrow;