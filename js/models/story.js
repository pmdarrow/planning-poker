var app = app || {};

(function () {
  app.Story = Backbone.Model.extend({
    defaults: {
      title: '',
      description: '',
      estimates: [],
      revealed: false
    },

    getKey: function () {
      return this.collection.getKey().key('/' + this.id);
    },

    serialize: function () {
      return JSON.stringify({
        id: this.id,
        title: this.get('title'),
        description: this.get('description'),
        estimates: this.get('estimates'),
        revealed: this.get('revealed'),
        createdAt: this.get('createdAt')
      });
    },

    estimateAverage: function() {
      var estimates = this.get('estimates');
      if (estimates.length === 0) {
        return 0;
      }
      return _.reduce(estimates, function(sum, estimate) {
        return sum + estimate
      }, 0) / estimates.length
    }
  });

  Backbone.Timestamp(app.Story);
})();
