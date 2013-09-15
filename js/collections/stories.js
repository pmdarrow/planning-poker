var app = app || {};

(function () {
  var Stories = Backbone.Collection.extend({
    model: app.Story,
    localStorage: new Backbone.LocalStorage('planning-poker-backbone'),

    revealed: function () {
      return this.filter(function (story) {
        return story.get('estimateRevealed');
      });
    },

    remaining: function () {
      return this.without.apply(this, this.revealed());
    },

    nextOrder: function () {
      if (!this.length) {
        return 1;
      }
      return this.last().get('order') + 1;
    },

    comparator: function (story) {
      return story.get('order');
    }
  });

  app.stories = new Stories();
})();
