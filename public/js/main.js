;
(function() {

	'use strict';

	var mobileMenuOutsideClick = function() {

		$(document).click(function(e) {
			var container = $("#itt-offcanvas, .js-itt-nav-toggle");
			if (!container.is(e.target) && container.has(e.target).length === 0) {
				$('.js-itt-nav-toggle').addClass('itt-nav-white');

				if ($('body').hasClass('offcanvas')) {

					$('body').removeClass('offcanvas');
					$('.js-itt-nav-toggle').removeClass('active');

				}
			}
		});

	};

	var offcanvasMenu = function() {

		$('#page').prepend('<div id="itt-offcanvas" />');
		$('#page').prepend('<a href="#" class="js-itt-nav-toggle itt-nav-toggle itt-nav-white"><i></i></a>');
		var clone1 = $('.menu-1 > ul').clone();
		$('#itt-offcanvas').append(clone1);
		var clone2 = $('.menu-2 > ul').clone();
		$('#itt-offcanvas').append(clone2);

		$('#itt-offcanvas .has-dropdown').addClass('offcanvas-has-dropdown');
		$('#itt-offcanvas')
			.find('li')
			.removeClass('has-dropdown');

		// Hover dropdown menu on mobile
		$('.offcanvas-has-dropdown').mouseenter(function() {
			var $this = $(this);

			$this
				.addClass('active')
				.find('ul')
				.slideDown(500, 'easeOutExpo');
		}).mouseleave(function() {

			var $this = $(this);
			$this
				.removeClass('active')
				.find('ul')
				.slideUp(500, 'easeOutExpo');
		});


		$(window).resize(function() {

			if ($('body').hasClass('offcanvas')) {

				$('body').removeClass('offcanvas');
				$('.js-itt-nav-toggle').removeClass('active');

			}
		});
	};

	var burgerMenu = function() {

		$('body').on('click', '.js-itt-nav-toggle', function(event) {
			var $this = $(this);


			if ($('body').hasClass('overflow offcanvas')) {
				$('body').removeClass('overflow offcanvas');
			} else {
				$('body').addClass('overflow offcanvas');
			}
			$this.toggleClass('active');
			event.preventDefault();

		});
	};



	var contentWayPoint = function() {
		var i = 0;

		$('.animate-box').waypoint(function(direction) {

			if (direction === 'down' && !$(this.element).hasClass('animated-fast')) {

				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function() {

					$('body .animate-box.item-animate').each(function(k) {
						var el = $(this);
						setTimeout(function() {
							var effect = el.data('animate-effect');
							if (effect === 'fadeIn') {
								el.addClass('fadeIn animated-fast');
							} else if (effect === 'fadeInLeft') {
								el.addClass('fadeInLeft animated-fast');
							} else if (effect === 'fadeInRight') {
								el.addClass('fadeInRight animated-fast');
							} else {
								el.addClass('fadeInUp animated-fast');
							}

							el.removeClass('item-animate');
						}, k * 50, 'easeInOutExpo');
					});

				}, 100);

			}

		}, {
			offset: '85%'
		});
	};

	var dropdown = function() {

		$('.has-dropdown').mouseenter(function() {

			var $this = $(this);
			$this
				.find('.dropdown')
				.css('display', 'block')
				.addClass('animated-fast fadeInUpMenu');

		}).mouseleave(function() {
			var $this = $(this);

			$this
				.find('.dropdown')
				.css('display', 'none')
				.removeClass('animated-fast fadeInUpMenu');
		});

	};

	var owlCarousel = function() {

		var owl = $('.owl-carousel-carousel');
		owl.owlCarousel({
			items: 3,
			loop: true,
			margin: 20,
			nav: true,
			dots: true,
			smartSpeed: 800,
			autoHeight: true,
			navText: [
				"<i class='fa fa-angle-left owl-direction'></i>",
				"<i class='fa fa-angle-right owl-direction'></i>"
			],
			responsive: {
				0: {
					items: 1
				},
				600: {
					items: 2
				},
				1000: {
					items: 3
				}
			}
		});

		var owl = $('.owl-carousel-fullwidth');
		owl.owlCarousel({
			items: 1,
			loop: true,
			margin: 20,
			nav: true,
			dots: true,
			smartSpeed: 800,
			autoHeight: true,
			navText: [
				"<i class='fa fa-angle-left owl-direction'></i>",
				"<i class='fa fa-angle-right owl-direction'></i>"
			]
		});
	};

	var tabs = function() {

		// Auto adjust height
		$('.itt-tab-content-wrap').css('height', 0);
		var autoHeight = function() {

			setTimeout(function() {

				var tabContentWrap = $('.itt-tab-content-wrap'),
					tabHeight = $('.itt-tab-nav').outerHeight(),
					formActiveHeight = $('.tab-content.active').outerHeight(),
					totalHeight = parseInt(tabHeight + formActiveHeight + 90);

				tabContentWrap.css('height', totalHeight);

				$(window).resize(function() {
					var tabContentWrap = $('.itt-tab-content-wrap'),
						tabHeight = $('.itt-tab-nav').outerHeight(),
						formActiveHeight = $('.tab-content.active').outerHeight(),
						totalHeight = parseInt(tabHeight + formActiveHeight + 90);

					tabContentWrap.css('height', totalHeight);
				});

			}, 100);

		};

		autoHeight();

		// Click tab menu
		$('.itt-tab-nav a').on('click', function(event) {

			var $this = $(this),
				tab = $this.data('tab');

			$('.tab-content')
				.addClass('animated-fast fadeOutDown');

			$('.tab-content')
				.removeClass('active');

			$('.itt-tab-nav li').removeClass('active');

			$this
				.closest('li')
				.addClass('active')

			$this
				.closest('.itt-tabs')
				.find('.tab-content[data-tab-content="' + tab + '"]')
				.removeClass('animated-fast fadeOutDown')
				.addClass('animated-fast active fadeIn');


			autoHeight();
			event.preventDefault();

		});
	};

	var goToTop = function() {

		$('.js-gotop').on('click', function(event) {

			event.preventDefault();

			$('html, body').animate({
				scrollTop: $('html').offset().top
			}, 500, 'easeInOutExpo');

			return false;
		});

		$(window).scroll(function() {

			var $win = $(window);
			if ($win.scrollTop() > 200) {
				$('.js-top').addClass('active');
			} else {
				$('.js-top').removeClass('active');
			}

		});

	};

	var goToContact = function() {

		$('.js-gotocontact').on('click', function(event) {

			event.preventDefault();

			$('html, body').animate({
				scrollTop: $('#itt-subscribe').offset().top
			}, 500, 'easeInOutExpo');

			return false;
		});

	};

	// Loading page
	var loaderPage = function() {
		$(".itt-loader").fadeOut("slow");
	};

	var counter = function() {
		$('.js-counter').countTo({
			formatter: function(value, options) {
				return value.toFixed(options.decimals);
			},
		});
	};

	var counterWayPoint = function() {
		if ($('#itt-counter').length > 0) {
			$('#itt-counter').waypoint(function(direction) {

				if (direction === 'down' && !$(this.element).hasClass('animated')) {
					setTimeout(counter, 400);
					$(this.element).addClass('animated');
				}
			}, {
				offset: '90%'
			});
		}
	};

	// var formValidator = function() {
	// 	$('#name').on('change', function(event) {

	// 		if (/^[-'a-zA-Z ]+$/.test($(this).val().trim())) {
	// 			$(this).attr('style', function(i, s) {
	// 				return s + 'border: 2px solid #4caf50 !important;'
	// 			});
	// 		} else {
	// 			$(this).attr('style', function(i, s) {
	// 				return s + 'border: 2px solid #f44336 !important;'
	// 			});
	// 		}

	// 		return false;
	// 	});

	// 	#('#email').on('keydown', function(event) {
	// 		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($(this).val().trim())) {
	// 			alert("Blah");
	// 		}

	// 		return false;
	// 	});
	// }

	$(function() {
		mobileMenuOutsideClick();
		offcanvasMenu();
		burgerMenu();
		contentWayPoint();
		dropdown();
		owlCarousel();
		tabs();
		goToTop();
		loaderPage();
		counterWayPoint();
		goToContact();
		// formValidator();
	});
}());