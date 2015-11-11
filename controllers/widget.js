/** @author: Alisson Chiquitto
 *  @email: chiquitto@gmail.com
 *  @description: Google Material Design Text Field Floating Label
 *  @version: 1.0
 */

var objectStyles = {
	footer : {
		backgroundColor : '#000000',
		height : 1,
		opacity : 0.38,
		top : 64,
	},
	footerUp : {
		backgroundColor : '#2196F3',
		height : 2,
		opacity : 0.83,
		top : 63,
	},
	// Default style
	hintDown : {
		color : '#000000',
		font : {
			fontSize : 16
		},
		opacity : 0.38,
		top : 40
	},
	// Style for focus in textfield
	hintFocus : {
		color : '#2196F3',
		font : {
			fontSize : 12
		},
		opacity : 0.83,
		top : 16,
	},
	// Style to the non-empty textfield
	hintUp : {
		color : '#000000',
		font : {
			fontSize : 12
		},
		opacity : 0.38,
		top : 16,
	},
};

//arguments
var args = arguments[0] || {};

//config references this
var _config = {
	color : {
		pattern : '#aaa',
		post : '#208FE5',
		exceedingColor : "FF0000"
	},
	duration : 200,
	editable : true,
	exceeding : false
};

//declare events in object
var _events = {
	CLICK : 'click',
	FOCUS : 'focus',
	BLUR : 'blur',
	CHANGE : 'change'
};

var _animation = {

	//animation up
	ANIMATION_UP : function() {
		if (!_config.editable)
			return;

		var lenHint = _.size($.hint.getText());
		var color = _config.exceeding ? _config.color.exceeding : _config.color.post;
		lenHint += lenHint * (Number(lenHint) > 25 ? 0.20 : 0.10);

		hintStyleApply(objectStyles.hintFocus, 1);
		footerStyleApply(objectStyles.footerUp, 1);
	},

	//animation down
	ANIMATION_DOWN : function() {
		if (!_config.editable)
			return;

		var lenHint = _.size($.hint.getText());
		var color = _config.exceeding ? _config.color.exceeding : _config.color.pattern;
		lenHint += lenHint * (Number(lenHint) > 25 ? 0.20 : 0.10);

		footerStyleApply(objectStyles.footer, 1);

		if (!$.textfield.getValue()) {
			hintStyleApply(objectStyles.hintDown, 1);
		} else {
			hintStyleApply(objectStyles.hintUp, 1);
		}

	}
};

function footerStyleApply(style, type) {
	if (type == 0) {
		$.footer.applyProperties(style);
	} else if (type == 1) {
		style.duration = _config.duration;
		$.footer.animate(style);
	}
}

function hintStyleApply(style, type) {
	if (type == 0) {
		$.hint.applyProperties(style);
	} else if (type == 1) {
		style.duration = _config.duration;
		$.hint.animate(style);

		if (OS_ANDROID) {
			require('animateColor').animateColor($.hint, style.color, 200);
		}
	}
}

//Exports Methods
exports.getValue = function() {
	return $.textfield.getValue();
};

exports.ANIMATION_UP = function() {
	_animation.ANIMATION_UP();
};

exports.ANIMATION_DOWN = function() {
	_animation.ANIMATION_DOWN();
};

exports.setValue = function(value, up) {
	if (up)
		_animation.ANIMATION_UP();

	$.textfield.setValue(value);
};

exports.listener = function(event, callback) {
	$.textfield.addEventListener(event, function(e) {
		callback(e);
	});
};

exports.blur = function(toFocus) {
	$.textfield.blur();
};

exports.focus = function() {
	$.textfield.focus();
};

$.textfield.addEventListener(_events.FOCUS, _animation.ANIMATION_UP);
$.textfield.addEventListener(_events.BLUR, _animation.ANIMATION_DOWN);

(function() {

	_config.color.post = args.colorFocus || _config.color.post;
	_config.color.pattern = args.colorPattern || _config.color.pattern;
	_config.color.exceeding = args.exceedingColor || "#FF0000";
	//red

	_config.duration = args.animationDuration || _config.duration;

	var _init = {
		titleHint : args.titleHint,
		width : args.width,
		top : args.top,
		left : args.left,
		right : args.right,
		bottom : args.bottom,
		colorFont : args.colorFont,
		keyboardType : args.keyboardType,
		returnKey : args.returnKey,
		password : args.password,
		editable : args.editable,
		maxLength : args.maxLength,
		minLength : args.minLength
	};

	if ( typeof _init.editable == "string")
		_init.editable = eval(_init.editable);

	if (!_init.titleHint)
		$.hint.setVisible(false);

	/**
	 * attrs element {id} container
	 */
	if (_init.width)
		$.container.setWidth(_init.width);

	if (_init.top)
		$.container.setTop(_init.top);

	if (_init.bottom)
		$.container.setBottom(_init.bottom);

	if (_init.left)
		$.container.setLeft(_init.left);

	if (_init.right)
		$.container.setRight(_init.right);

	//if (_init.colorFont)
	//	$.textfield.setColor(_init.colorFont);

	if (_init.keyboardType)
		$.textfield.setKeyboardType(_init.keyboardType);

	if (_init.returnKey)
		$.textfield.setReturnKeyType(_init.returnKey);

	if (_init.password)
		$.textfield.setPasswordMask(_init.password);

	$.hint.setText(_init.titleHint);

	hintStyleApply(objectStyles.hintDown, 0);
	footerStyleApply(objectStyles.footer, 0);

})();
