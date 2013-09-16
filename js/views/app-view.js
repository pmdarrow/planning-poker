var app = app || {};

(function ($) {
  app.AppView = Backbone.View.extend({
    el: '#planning-poker-app',
    goInstantUrl: 'https://goinstant.net/pmdarrow/planning-poker',
    goInstantRoom: 'planning-poker',
    events: {
      'submit #create-story-form': 'createOnSubmit'
    },

    initialize: function () {
      this.$title = this.$('#new-story-title');
      this.$description = this.$('#new-story-description');
      this.$main = this.$('#main');

      this.listenTo(app.stories, 'add', this.addOne);
      this.listenTo(app.stories, 'reset', this.addAll);

      app.GoInstantStore = new GoInstantStore(this.goInstantUrl,
        this.goInstantRoom, function() {
          Backbone.sync = _.bind(this.sync, this);
          app.stories.fetch({reset: true});
          this.listenForUpdates(app.stories);
        });
    },

    render: function () {
      if (app.stories.length) {
        this.$main.show();
      } else {
        this.$main.hide();
      }
    },

    addOne: function (story) {
      var view = new app.StoryView({ model: story });
      $('#story-list').append(view.render().el);
    },

    addAll: function () {
      this.$('#story-list').html('');
      app.stories.each(this.addOne, this);
    },

    newAttributes: function () {
      return {
        title: this.$title.val().trim(),
        description: this.$description.val().trim()
      };
    },

    createOnSubmit: function () {
      if (this.$title.val() === '') {
        return false;
      }

      app.stories.create(this.newAttributes());

      this.$title.val('');
      this.$description.val('');
      return false;
    }
  });
})(jQuery);
