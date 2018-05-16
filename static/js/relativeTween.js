this.createjs = this.createjs||{};
(function() {
	"use strict";

	/**
	 * The RelativePlugin for TweenJS enables relative numeric values for tweens. Install using:
	 *
	 * 	RotationPlugin.install();
	 *
	 * Once installed, you can pass in relative numeric property values as strings beginning with "+" or "-". For example,
	 * the following tween would tween the x position of `foo` from its initial value of `200` to `50` (200-150), then to
	 * `125` (50+75).
	 *
	 * 	foo.x = 200;
	 * 	Tween.get(foo).to({x:"-150"}, 500).to({x:"+75"}, 500);
	 *
	 * @class RelativePlugin
	 * @constructor
	 **/
	function RelativePlugin() {
		throw("RelativePlugin plugin cannot be instantiated.")
	}
	var s = RelativePlugin;

	/**
	 * READ-ONLY. A unique identifying string for this plugin. Used by TweenJS to ensure duplicate plugins are not installed on a tween.
	 * @property ID
	 * @type {String}
	 * @static
	 * @readonly
	 **/
	s.ID = "Relative";

	/**
	 * Installs this plugin for use with TweenJS. Call this once after TweenJS is loaded to enable this plugin.
	 * @method install
	 * @static
	 **/
	s.install = function() {
		createjs.Tween._installPlugin(RelativePlugin);
	};

	/**
	 * Called by TweenJS when a new property initializes on a tween.
	 * See {{#crossLink "SamplePlugin/init"}}{{/crossLink}} for more info.
	 * @method init
	 * @param {Tween} tween
	 * @param {String} prop
	 * @param {any} value
	 * @return {any}
	 * @static
	 **/
	s.init = function(tween, prop, value) {
		if (!tween.pluginData.Relative_disabled) { tween._addPlugin(s); }
	};

	/**
	 * Called when a new step is added to a tween (ie. a new "to" action is added to a tween).
	 * See {{#crossLink "SamplePlugin/step"}}{{/crossLink}} for more info.
	 * @method step
	 * @param {Tween} tween
	 * @param {TweenStep} step
	 * @param {Object} props
	 * @static
	 **/
	s.step = function(tween, step, props) {
		// in this method we check if any prop is a string value starting with "+" or "-", and adjust the value accordingly.
		for (var n in props) {
			var value = props[n];
			if (typeof value !== "string") { continue; }
			var prev = step.prev.props[n], char0 = value[0];
			if (!(char0 === "+" || char0 === "-") || isNaN(value = +value+prev)) { continue; }
			step.props[n] = value;
		}
	};

	/**
	 * Called before a property is updated by the tween.
	 * See {{#crossLink "SamplePlugin/change"}}{{/crossLink}} for more info.
	 * @method change
	 * @param {Tween} tween
	 * @param {TweenStep} step
	 * @param {String} prop
	 * @param {any} value
	 * @param {Number} ratio
	 * @param {Boolean} end
	 * @return {any}
	 * @static
	 **/
	s.change = function(tween, step, prop, value, ratio, end) {
		// nothing
	};

	createjs.RelativePlugin = s;
}());
