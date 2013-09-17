var app = app || {};

(function ($) {
  app.StoryView = Backbone.View.extend({
    tagName: 'li',
    className: 'list-group-item',
    template: _.template($('#story-template').html()),
    attributes: {'href': '#'},
    events: {
      'click .edit-btn': 'edit',
      'click .delete-btn': 'destroy',
      'click .reveal-btn': 'revealEstimate',
      'submit .edit-form': 'update',
      'click .cancel': 'cancelEdit'
    },

    initialize: function () {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function () {
      this.$el.html(this.template({story: this.model}));
      this.$title = this.$('#story-title');
      this.$description = this.$('#story-description');
      this.$estimate = this.$('#story-estimate');
      return this;
    },

    edit: function () {
      this.$el.addClass('editing');
      this.$title.focus();
      return false;
    },

    cancelEdit: function () {
      this.$el.removeClass('editing');
      return false;
    },

    update: function () {
      var trimmedTitle = this.$title.val().trim();
      var trimmedDescription = this.$description.val().trim();
      var trimmedEstimate = parseInt(this.$estimate.val().trim());
      this.$title.val(trimmedTitle);
      this.$description.val(trimmedDescription);

      if (trimmedTitle) {
        var values = {
          title: trimmedTitle,
          description: trimmedDescription
        };
        if (trimmedEstimate) {
          values.estimates = this.model.get('estimates')
            .concat(trimmedEstimate);
        }
        this.model.save(values);
      }

      this.cancelEdit();
      return false;
    },

    revealEstimate: function () {
      this.model.save({revealed: true});
      return false;
    },

    destroy: function() {
      this.model.destroy();
    }
  });
})(jQuery);
