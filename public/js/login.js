$(document).ready(function() {

	$('#login').on('click', function(e) {
		e.preventDefault();

		var username = $('#username').val().trim();
		var password = $('#password').val().trim();

		if (password != "" && username != "") {
			fireAJAX(username, password);
		}

		if (username == '') {
			$('#username').addClass('form-control-error');
			$('#username').attr('placeholder', 'Username can\'t be empty');
		} else {
			$('#username').removeClass('form-control-error');
			$('#username').attr('placeholder', 'Your Username');
		}

		if (password == '') {
			$('#password').addClass('form-control-error');
			$('#password').attr('placeholder', 'Password can\'t be empty');
		} else {
			$('#password').attr('placeholder', 'Your Password');
		}
	});

	function fireAJAX(username, password) {
		$.ajax({
			type: 'POST',
			url: '/login',
			data: {
				username: username,
				password: password
			},
			beforeSend: function(xhr) {
				toggleLoader();
				$('#username').removeClass('form-control-error');
				$('#password').removeClass('form-control-error');
			},
			success: success,
			error: error
		});
	}

	var toggleLoader = function() {
		$('#loader').toggleClass('is-active');
	};

	function success(data) {
		// $('#itt-subscribe').show();
		// $('.itt-section').hide();
		toggleLoader();
	}

	function error(data) {
		$('.error').show();
		toggleLoader();
	}
});
// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function() {
	var cache = {};

	this.tmpl = function tmpl(str, data) {
		// Figure out if we're getting a template, or if we need to
		// load the template - and be sure to cache the result.
		var fn = !/\W/.test(str) ?
			cache[str] = cache[str] ||
			tmpl(document.getElementById(str).innerHTML) :

			// Generate a reusable function that will serve as a template
			// generator (and which will be cached).
			new Function("obj",
				"var p=[],print=function(){p.push.apply(p,arguments);};" +

				// Introduce the data as local variables using with(){}
				"with(obj){p.push('" +

				// Convert the template into pure JavaScript
				str
				.replace(/[\r\t\n]/g, " ")
				.split("{{").join("\t") // modified
				.replace(/((^|\}\})[^\t]*)'/g, "$1\r") // modified
				.replace(/\t=(.*?)}}/g, "',$1,'") // modified
				.split("\t").join("');")
				.split("}}").join("p.push('") // modified
				.split("\r").join("\\'") + "');}return p.join('');");

		// Provide some basic currying to the user
		return data ? fn(data) : fn;
	};
})();