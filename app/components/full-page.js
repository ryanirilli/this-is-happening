export default Em.Component.extend({
	classNames: ['full-page'],
	jqWindow: null,
	width: null,
	height: null,
	advancePageLink: false,
	youtubeApiLoaded: false,
	onInit: function(){
		var self = this;
		this.set('jqWindow', $(window));
		this.get('jqWindow').on('resize', function(){
			self._setHeight();
		});

		if(this.get('backgroundVideo') && ! window.YT){
			$.ajax({
			  url: 'http://www.youtube.com/player_api',
			  dataType: "script",
			});

			window.onYouTubeIframeAPIReady = function() {
				self.set('youtubeApiLoaded', true);
			};
		}
	}.on('init'),

	youtubeApiLoadedObserver: function(){
		var self = this;
		var $el = this.$('.bg-video');
		var YT = window.YT;
		var id = 'yt-player-' + this.get('elementId');
		$el.attr('id', id);

		var player = new YT.Player(id, {
          height: '100%',
          width: '100%',
          playerVars: {
			controls: 0,
			wmode:'opaque',
			autoplay: true,
			loop: 1,
			playlist: this.get('videoId'),
			showinfo: 0,
          },
          videoId: this.get('videoId'),
          modestbranding: 1,
          events: {
            onReady: this._onYoutubePlayerReady,
            onStateChange: function(state){
            	self._onYoutubePlayerStateChange(state.data);
            }
          }
        });
	}.observes('youtubeApiLoaded'),

	_onYoutubePlayerReady: function(){
		
	},

	_onYoutubePlayerStateChange: function(state){
		var $el = this.$('.bg-video');
		if(state === 1){
			$el.fadeIn();
		}else{
			$el.fadeOut('fast');
		}
	},

	afterInsertElement: function(){
		this._setHeight();
	}.on('didInsertElement'),

	_setHeight: function(){
		var jqwindow = this.get('jqWindow'),
			height = jqwindow.height(),
			width = jqwindow.width();
		var $el = this.$();
		$el.height(height);
		$el.width(width);
		this.setProperties({
			width: width,
			height: height
		});
	},

	actions: {
		advancePage: function(){
			var position = $(window).scrollTop() + this.$()[0].scrollHeight;
			$("html, body").animate({ 
				scrollTop: position
			}, 
			500);
		}
	},

	willDestroyElement: function(){
		this.get('jqWindow').off('resize');
	}

});