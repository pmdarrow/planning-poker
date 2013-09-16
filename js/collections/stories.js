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

    revealed: function () {
      return this.filter(function (story) {
        return story.get('estimateRevealed');
      });
    },

    remaining: function () {
      return this.without.apply(this, this.revealed());
    }
  });

  app.stories = new Stories();
})();
