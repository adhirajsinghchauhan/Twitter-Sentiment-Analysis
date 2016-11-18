$(document).ready(function() {

	$('#itt-subscribe').hide();
	$('.itt-section').hide();
	$('#signup-layout').hide();
	$('#login-layout').hide();

	$('#js-gotosignup').on('click', function(e) {
		e.preventDefault();

		$('.itt-section').show();
		$('#login-layout').hide();
		$('#signup-layout').show();

		$('html, body').animate({
			scrollTop: $('#signup-layout').offset().top
		}, 500, 'easeInOutExpo');
	});

	$('#js-gotologin').on('click', function(e) {
		e.preventDefault();

		$('.itt-section').show();
		$('#signup-layout').hide();
		$('#login-layout').show();


		$('html, body').animate({
			scrollTop: $('#login-layout').offset().top
		}, 500, 'easeInOutExpo');
	});

	$('#signup').on('click', function(e) {
		e.preventDefault();

		var username = $('#username').val().trim();
		var email = $('#email').val().trim();
		var password = $('#password').val().trim();
		var confirmPassword = $('#confirmPassword').val().trim();

		if (password != "" && password == confirmPassword && username != "" && validateEmail(email)) {
			fireAJAX(username, email, password);
		}

		if (username == '') {
			$('#username').addClass('form-control-error');
			$('#username').attr('placeholder', 'Username can\'t be empty');
		} else {
			$('#username').removeClass('form-control-error');
			$('#username').attr('placeholder', 'Your Username');
		}

		if (!validateEmail(email)) {
			$('#email').addClass('form-control-error');
			$('#email').attr('placeholder', 'E-Mail isn\'t valid');
		} else {
			$('#email').removeClass('form-control-error');
			$('#email').attr('placeholder', 'E-Mail');
		}

		if (password == '') {
			$('#password').addClass('form-control-error');
			$('#confirmPassword').addClass('form-control-error');
			$('#password').attr('placeholder', 'Password can\'t be empty');
		} else if (password != confirmPassword) {
			$('#password').attr('placeholder', 'Passwords don\'t match');
			$('#confirmPassword').attr('placeholder', 'Passwords don\'t match');
		} else {
			$('#password').attr('placeholder', 'Your Password');
			$('#confirmPassword').attr('placeholder', 'Confirm Password');
		}
	});

	function validateEmail(email) {
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
			return true;
		}
		return false;
	}

	function fireAJAX(username, email, password) {
		$.ajax({
			type: 'POST',
			url: '/signup',
			data: {
				username: username,
				email: email,
				password: password
			},
			beforeSend: function(xhr) {
				toggleLoader();
				$('#username').removeClass('form-control-error');
				$('#email').removeClass('form-control-error');
				$('#password').removeClass('form-control-error');
				$('#confirmPassword').removeClass('form-control-error');
			},
			success: success,
			error: error
		});
	}

	var toggleLoader = function() {
		$('#loader').toggleClass('is-active');
	};

	function success(data) {
		$('#itt-subscribe').show();
		$('.itt-section').hide();
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