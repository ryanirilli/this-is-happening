import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['vimeo-video'],
	data: null,
	isWatching: false,

	onInit: function(){
		var $ = window.jQuery;
		var Em = window.Em;
		var id = this.get('vimeoId');

		if(!id){
			Em.assert('must provide vimeo id');
			return;
		}

		var self = this;
		var url = 'http://vimeo.com/api/v2/video/' + id + '.json';
		var xhr = $.ajax({
			url: url
		});

		xhr.done(function(data){
			self.set('data', Em.Object.create(data[0]));
		});

	}.on('init'),

	onDataLoad: function(){
		Em.run.scheduleOnce('afterRender', this, function(){
			var self = this;
			this.$('img').load($.proxy(self._setHeight, self));
		});
	}.observes('data'),

	afterDidInsertElement: function(){
		var $f = window.$f;
		if(!$f){ return; }

		this._setupEvents();

	}.on('didInsertElement'),

	url: function(){
		return '//player.vimeo.com/video/' + this.get('vimeoId') + '?title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff';
	}.property(),

	_playMovie: function(){
		var self = this;
		var url = 'http://vimeo.com/api/oembed.json?url=http%3A//vimeo.com/' + this.get('vimeoId');
		var xhr = $.ajax({
			url: url
		});

		xhr.done(function(data){
			self.setProperties({
				isWatching: true,
				video: data.html
			});
		});
	},

	_setupVidControls: function(){
		if(!this.get('isWatching')){
			this.set('iframe', null);
			return;
		}

		Em.run.scheduleOnce('afterRender', this, function(){
			var self = this;
			var iframe = this.$('iframe');

			self.set('iframe', iframe);
			self._toggleSpinner();

			iframe.hide();

		    iframe.data('aspectRatio', iframe.height() / iframe.width())
		    .removeAttr('height')
		    .removeAttr('width');
		    self._onWindowResize();

			iframe.load(function(){
				iframe.show();
				self._toggleSpinner();
				var player = $f(iframe[0]);
				self.set('player', player);
		    	player.api('play');
		    	player.addEvent('finish', $.proxy(self._onFinish, self));
			});
		});
	}.observes('isWatching'),

	_onFinish: function(){
		this.set('isWatching', false);
	},

	_setupEvents: function(){
		var self = this;
		this.$().on('click', $.proxy(this._playMovie, this));
		this.$().hover($.proxy(this._toggleTitle, this));
		$(window).on('resize.' + this.get('elementId'), $.proxy(this._onWindowResize, this));
	},

	_teardownEvents: function(){
		$(window).off('resize.' + this.get('elementId'));
		this.$().off('click');
		this.$().unbind('mouseenter mouseleave');
	},

	_onWindowResize: function(){
		var iframe = this.get('iframe');
		var newWidth = this.$().width();

		if(!iframe){
			return;
		}

    	iframe.width(newWidth);
    	iframe.height(newWidth * iframe.data('aspectRatio'));
	},

	_toggleTitle: function(){
		this.$('.title__text').toggleClass('title__text--animation');
	},

	_toggleSpinner: function(){
		this.$('.spinner').toggle();
	},

	willDestroyElement: function(){
		this._teardownEvents();
	}
});
