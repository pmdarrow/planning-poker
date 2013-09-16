var app = app || {};

(function ($) {
  app.AppView = Backbone.View.extend({
    el: '#planning-poker-app',
    statsTemplate: _.template($('#stats-template').html()),
    goInstantUrl: 'https://goinstant.net/pmdarrow/planning-poker',
    goInstantRoom: 'planning-poker',
    events: {
      'submit #create-story-form': 'createOnSubmit'
    },

    initialize: function () {
      this.$title = this.$('#new-story-title');
      this.$description = this.$('#new-story-description');
      this.$footer = this.$('#footer');
      this.$main = this.$('#main');

      this.listenTo(app.stories, 'add', this.addOne);
			this.listenTo(app.stories, 'reset', this.addAll);

      app.GoInstantStore = new GoInstantStore(this.goInstantUrl,
        this.goInstantRoom, function() {
          Backbone.sync = _.bind(this.sync, this);
          app.stories.fetch({reset: true});
          this.listenForUpdates(app.stories, app.stories.goInstantUpdate);
        });
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function () {
      var revealed = app.stories.revealed().length;
      var remaining = app.stories.remaining().length;

      if (app.stories.length) {
        this.$main.show();
        this.$footer.show();

        this.$footer.html(this.statsTemplate({
          revealed: revealed,
          remaining: remaining
        }));

        this.$('#filters li a')
          .removeClass('selected')
          .filter('[href="#/' + (app.StoryFilter || '') + '"]')
          .addClass('selected');
      } else {
        this.$main.hide();
        this.$footer.hide();
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

    createOnSubmit: function (e) {
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
