var Modal = function (config) {

	var config = config || {handlers: {}};
	config.header = config.header || "Title";
	config.color = config.color || false;
	config.body = config.body || "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero, quod.";
	config.opts = config.opts || {backdrop: true};
	config.NOYES = config.NOYES || false;

	var footer = $('<div class="modal-footer"></div>');
	var dom = $('<div class="modal fade" '+ (config.color ? "data-modal-color=" + config.color : "" ) +' tabindex="-1" role="dialog">' +
			  '<div class="modal-dialog">' +
			    '<div class="modal-content">' +
			      '<div class="modal-header">' +
			        '<h4 class="modal-title">'+ config.header +'</h4>' +
			      '</div>' +
			      '<div class="modal-body">' +
			        config.body +
			      '</div>' +
			    '</div>' +
			  '</div>' +
			'</div>');

	footer.insertAfter(dom.find(".modal-body"));

	if(config.buttons) {
		footer.append(config.buttons);
	}

	else {
		var cancel = $('<button class="btn btn-link" type="button" data-dismiss="modal" autofocus>cancelar</button>');
		var confirm = $('<button class="btn btn-link" type="button" data-dismiss="modal">confirmar</button>');

		var buttons = [cancel, confirm];

		if(config.NOYES) buttons.reverse();

		footer.append(buttons);
	}

	if(config.handlers) {
		var cancelHandler = config.handlers.cancel || function () {};
		var confirmHandler = config.handlers.confirm || function () {};

		cancel.on("click", cancelHandler);
		confirm.on("click", confirmHandler);
	}

	var modal = new this.create(dom, config.opts);
	$("body").append(modal);

	return modal;
}

Modal.prototype.create = fn.Modal;

/*var modal = new Modal({
	header: 'My modal',
	body: 'Nothing to say',
	buttons: $('<button class="btn btn-primary" data-dismiss="modal">confirmar</button>')
});

modal.show();*/