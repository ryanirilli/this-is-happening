import Ember from 'ember';

export default Ember.Controller.extend({
	videos: null,
	currentVideo: null,
	isVideoDataLoaded: false,
	idIndex: 0,

	onInit: function(){
		var self = this;
		var xhr = $.ajax({
			url: 'http://vimeo.com/api/v2/thisishappening/videos.json'
		});

		this.set('videos', []);

		xhr.done(function(data){
			var videos = [];
			var sessions = [];
			var harley, alexClare, majorLazer;
			
			$.each(data, function(i, item){ 
				if(item.title.indexOf('Sasquatch Sessions') >= 0) {
					sessions.push(Em.Object.create({
						_id: self._generateId(),
						title: item.title.split(':')[1].trim(),
						data: item
					}));
				} else if(item.title.indexOf('Harley Davidson') >= 0) {
					harley = item;
				} else if(item.title.indexOf('Major Lazer') >= 0) {
					majorLazer = item;
				} else if(item.title.indexOf('Alex Clare') >= 0){
					alexClare = item;
				}
			});
			
			self._addVideoItem(majorLazer, {
				_id: self._generateId(),
				title: 'Major Lazer'
			});

			self._addVideoItem(harley, {
				_id: self._generateId(),
				title: 'Harley Davidson'
			});

			self._addVideoItem(sessions, {
				_id: self._generateId(),
				title: 'Sasquatch Sessions',
				isAccordion: true
			});

			self._addVideoItem(alexClare, {
				_id: self._generateId(),
				title: 'Alex Clare'
			});
			
			self.set('isVideoDataLoaded', true);
			
		});

	}.on('init'),

	_addVideoItem: function(item, opts){
		var defaults = {
			data: item
		};
		var data = $.extend(defaults, opts);
		this.get('videos').pushObject(Em.Object.create(data));
	},

	_generateId: function(){
		var index = this.get('idIndex');
		this.incrementProperty('idIndex');
		return Date.parse(new Date()) + '-' + index;
	},

	actions: {
		goToVideo: function(video){
			this.set('currentVideo', video);
		}
	}
});
