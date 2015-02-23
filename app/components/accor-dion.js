import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['accordion'],
	items: null,

	afterDidInsertElement: function(){
		Em.run.scheduleOnce('afterRender', this, function(){
			var self = this;
			var counter = 0;
			var items = this.$('.accordion-item').map(function(i, item){
				var id = self.$().attr('id') + '-' + counter++;
				var body = $('.accordion-body', item);
				var bodyHeight = body.height();
				body.height(0);
				$(item).attr('id', id);
				return{
					id: id,
					height: bodyHeight
				}
			});

			this.set('items', Ember.A($.makeArray(items)));
			this.$('li:eq(0)').addClass('current');
		});
	}.observes('isReady'),

	_toggleBody: function(target){
		if(target.hasClass('open')){
			target.removeClass('open');
			this._setHeight(0, target);
		} else {
			target.addClass('open');
			var selected = this.get('items').findBy('id', target.attr('id'));
			this._setHeight(selected.height, target);	
		}
	},

	_setHeight: function(height, target){
		$('.accordion-body', target).animate({
			height: height
		}, 'fast');
	},

	click: function(e){
		var target = $(e.target);
		this.$('.current').removeClass('current');
		target.addClass('current');
		if(target.hasClass('accordion-item')){
			target.removeClass('current');
			this._toggleBody(target);
		}
	}
});
