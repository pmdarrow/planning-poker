var app = app || {};

(function ($) {
  app.AppView = Backbone.View.extend({
    el: '#planning-poker-app',
    statsTemplate: _.template($('#stats-template').html()),
    events: {
      'submit #create-story-form': 'createOnSubmit'
    },

    initialize: function () {
      this.$title = this.$('#new-story-title');
      this.$description = this.$('#new-story-description');
      this.$createStory = this.$('#create-story');
      this.$footer = this.$('#footer');
      this.$main = this.$('#main');

      this.listenTo(app.stories, 'add', this.addOne);
//			this.listenTo(app.stories, 'reset', this.addAll);
//			this.listenTo(app.stories, 'change:revealed', this.filterOne);
//			this.listenTo(app.stories, 'filter', this.filterAll);
//			this.listenTo(app.stories, 'all', this.render);

      // Suppresses 'add' events with {reset: true} and prevents the app view
      // from being re-rendered for every model. Only renders when the 'reset'
      // event is triggered at the end of the fetch.
      app.stories.fetch({reset: true});
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

    // Add a single story to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function (story) {
      var view = new app.StoryView({ model: story });
      $('#story-list').append(view.render().el);
    },

    // Add all items in the Stories collection at once.
    addAll: function () {
      this.$('#story-list').html('');
      app.stories.each(this.addOne, this);
    },

    filterOne: function (story) {
      story.trigger('visible');
    },

    filterAll: function () {
      app.stories.each(this.filterOne, this);
    },

    newAttributes: function () {
      return {
        order: app.stories.nextOrder(),
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

    // Clear all completed todo items, destroying their models.
//		clearCompleted: function () {
//			_.invoke(app.stories.completed(), 'destroy');
//			return false;
//		},
//
//		toggleAllComplete: function () {
//			var completed = this.allCheckbox.checked;
//
//			app.stories.each(function (story) {
//				story.save({
//					'completed': completed
//				});
//			});
//		}
  });
})(jQuery);
