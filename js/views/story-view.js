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
      'submit .edit-form': 'update',
      'click .cancel': 'cancelEdit'
    },

    initialize: function () {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      this.$title = this.$('#story-title');
      this.$description = this.$('#story-description');
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
      this.$title.val(trimmedTitle);
      this.$description.val(trimmedDescription);

      if (trimmedTitle) {
        this.model.save({
          title: trimmedTitle,
          description: trimmedDescription
        });
      }

      this.cancelEdit();
    },

    destroy: function() {
      this.model.destroy();
    }
  });
})(jQuery);
