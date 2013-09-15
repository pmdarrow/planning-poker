var app = app || {};

(function () {
	app.Story = Backbone.Model.extend({
		defaults: {
      order: 1,
			title: '',
      description: '',
			estimateRevealed: false
		},

		toggle: function () {
			this.save({
				revealed: !this.get('revealed')
			});
		}
	});
})();
