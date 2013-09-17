var app = app || {};

(function () {
  var Stories = Backbone.Collection.extend({
    model: app.Story,

    getKey: function() {
      return app.GoInstantStore.room.key('/stories');
    },

    remoteSet: function(value) {
      console.log('Received a remote set with the value:', value);
      this.fetch({reset: true});
    },

    remoteRemove: function() {
      console.log('Received a remote remove');
      this.fetch({reset: true});
    },

    comparator: function(story) {
      return new Date(story.get('createdAt'));
    }
  });

  app.stories = new Stories();
})();
