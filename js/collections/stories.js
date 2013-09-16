var app = app || {};

(function () {
  var Stories = Backbone.Collection.extend({
    model: app.Story,

    getKey: function() {
      return app.GoInstantStore.room.key('/stories');
    },

    goInstantUpdate: function() {
      console.log('goinstant stories update');
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
