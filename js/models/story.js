var app = app || {};

(function () {
  app.Story = Backbone.Model.extend({
    defaults: {
      title: '',
      description: ''
    },

    getKey: function () {
      return this.collection.getKey().key('/' + this.id);
    },

    serialize: function () {
      return JSON.stringify({
        id: this.id,
        title: this.get('title'),
        description: this.get('description')
      });
    }
  });
})();
