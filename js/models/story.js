var app = app || {};

(function () {
  app.Story = Backbone.Model.extend({
    defaults: {
      order: 1,
      title: '',
      description: ''
    }
  });
})();
