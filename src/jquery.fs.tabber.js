;(function ($, window) {
	"use strict";

	/**
	 * @options
	 * @param customClass [string] <''> "Class applied to instance"
	 * @param maxWidth [string] <'980px'> "Width at which to auto-disable plugin"
	 */
	var options = {
		customClass: "",
		maxWidth: "980px"
	};

	var pub = {

		/**
		 * @method
		 * @name defaults
		 * @description Sets default plugin options
		 * @param opts [object] <{}> "Options object"
		 * @example $(".target").tabber("defaults", opts);
		 */
		defaults: function(opts) {
			options = $.extend(options, opts || {});
			return $(this);
		},

		/**
		 * @method
		 * @name destroy
		 * @description Removes instance of plugin
		 * @example $(".target").tabber("destroy");
		 */
		destroy: function() {
			return $(this).each(function(i) {
				var data = $(this).data("tabber");

				if (data !== null) {
					$(this).removeClass("tabber initialized " + data.customClass)
						   .off(".tabber")
						   .data("tabber", null);
				}
			});
		},

		/**
		 * @method
		 * @name select
		 * @description Activates the specified tab
		 * @param index [int] "Index to activate"
		 * @example $(".target").tabber("select", 1);
		 */
		select: function(index) {
			return $(this).each(function(i) {
				var data = $(this).data("tabber");

				if (data !== null) {
					_set(data, index - 1);
				}
			});
		}
	};

	/**
	 * @method private
	 * @name _init
	 * @description Initializes plugin
	 * @param opts [object] "Initialization options"
	 */
	function _init(opts) {
		// Local options
		opts = $.extend({}, options, opts || {});

		// Apply to each element
		var $items = $(this);
		for (var i = 0, count = $items.length; i < count; i++) {
			_build($items.eq(i), opts);
		}
		return $items;
	}

	/**
	 * @method private
	 * @name _build
	 * @description Builds each instance
	 * @param $select [jQuery object] "Target jQuery object"
	 * @param opts [object] <{}> "Options object"
	 */
	function _build($tabber, opts) {
		if (!$tabber.data("tabber")) {
			// Extend Options
			opts = $.extend({}, opts, $tabber.data("tabber-options"));

			$tabber.addClass("tabber " + opts.customClass);

			var data = $.extend({
				$tabber: $tabber,
				$tabs: $tabber.find(".tabber-tab"),
				$handles: $tabber.find(".tabber-handle").not(".mobile")
			}, opts);

			for (var i = 0, count = data.$handles.length; i < count; i++) {
				data.$tabs.eq(i).before('<span class="tabber-handle mobile">' + data.$handles.eq(i).text() + '</span>');
			}
			data.$mobileHandles = $tabber.find(".tabber-handle.mobile");

			$tabber.addClass("initialized")
				   .on("click.tabber", ".tabber-handle", data, _onClick)
				   .data("tabber", data);

			// Navtive MQ Support
			if (window.matchMedia !== undefined) {
				data.mediaQuery = window.matchMedia("(max-width:" + (data.maxWidth === Infinity ? "100000px" : data.maxWidth) + ")");
				// Make sure we stay in context
				data.mediaQuery.addListener(function() {
					_onRespond.apply(data.$tabber);
				});
				_onRespond.apply(data.$tabber);
			}

			_set(data, 0);
		}
	}

	/**
	 * @method private
	 * @name _onClick
	 * @description Handles click event on tab
	 * @param e [object] "Event data"
	 */
	function _onClick(e) {
		e.preventDefault();
		e.stopPropagation();

		var $target = $(this),
			data = e.data,
			index = ($target.hasClass("mobile")) ? data.$mobileHandles.index($target) : data.$handles.index($target);

		_set(data, index);
	}

	/**
	 * @method private
	 * @name _set
	 * @description Sets the active tab
	 * @param e [object] "Event data"
	 */
	function _set(data, index) {
		if (!data.$tabs.eq(index).hasClass("active")) {
			data.$handles.removeClass("active")
						 .eq(index)
						 .addClass("active");

			data.$mobileHandles.removeClass("active")
							   .eq(index)
							   .addClass("active");

			data.$tabs.removeClass("active")
					  .eq(index)
					  .addClass("active");
		}
	}

	/**
	 * @method private
	 * @name _onRespond
	 * @description Handles media query match change
	 */
	function _onRespond() {
		var data = $(this).data("tabber");

		if (data.mediaQuery.matches) {
			data.$tabber.addClass("mobile");
		} else {
			data.$tabber.removeClass("mobile");
		}
	}

	$.fn.tabber = function(method) {
		if (pub[method]) {
			return pub[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return _init.apply(this, arguments);
		}
		return this;
	};
})(jQuery, this);