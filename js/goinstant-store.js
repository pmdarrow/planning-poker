var GoInstantStore = GoInstantStore || {};

(function ($) {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }

  function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  }

  GoInstantStore = function(url, room, callback) {
    this.platform = new goinstant.Platform(url);
    this.platform.connect(_.bind(function(err) {
      if (err) {
        console.log("Error connecting to GoInstant:", err);
        return;
      }
      console.log("Connected to GoInstant");
      this.room = this.platform.room(room);
      this.room.join(_.bind(function(err, room) {
        if (err) {
          console.log('Error joining room:', err);
          return;
        }
        console.log('Joined room:', room);
        callback.call(this);
      }, this));
    }, this));
  };

  _.extend(GoInstantStore.prototype, {
    listenForUpdates: function(collection) {
      // Listen for sets
      var options = {
        bubble: true,
        listener: _.bind(collection.remoteSet, collection)
      };
      collection.getKey().on('set', options, function(err) {
        if (err) {
          console.log('There was a problem setting up the set listener:', err);
        }
      });

      // Listen for removes
      options = {
        bubble: true,
        listener: _.bind(collection.remoteRemove, collection)
      };
      collection.getKey().on('remove', options, function(err) {
        if (err) {
          console.log('There was a problem setting up the remove listener:', err);
        }
      });
    },

    setKey: function(model, options) {
      var key = model.getKey();
      key.set(model.serialize(), function(err) {
        if (err) {
          return options.error('Error setting GoInstant key: ' + err);
        }
        console.log('Successfully set key', key);
        return options.success(model);
      });
    },

    find: function(model, options) {
      console.log('Find not implemented.');
    },

    findAll: function(collection, options) {
      collection.getKey().get(function(err, value, context) {
        if (err) {
          return options.error('Error fetching GoInstant key: ' + err);
        }
        var collection = _.map(value, function(value) {
          return JSON.parse(value);
        });
        return options.success(collection);
      });
    },

    create: function(model, options) {
      if (!model.id) {
        model.id = guid();
        model.set(model.idAttribute, model.id);
      }
      this.setKey(model, options);
    },

    update: function(model, options) {
      this.setKey(model, options);
    },

    destroy: function(model, options) {
      if (model.isNew()) {
        return options.success();
      }
      var key = model.getKey();
      return key.remove(function(err) {
        if (err) {
          return options.error('Error removing GoInstant key: ' + err);
        }
        console.log('Successfully removed key', key);
        return options.success(model);
      });
    },

    sync: function(method, model, options) {
      console.log('Sync:', method, model, options);

      switch (method) {
        case "read":
          if (model.id !== undefined) {
            this.find(model, options)
          } else {
            this.findAll(model, options);
          }
          break;
        case "create":
          this.create(model, options);
          break;
        case "update":
          this.update(model, options);
          break;
        case "delete":
          this.destroy(model, options);
          break;
      }
    }
  });
})(jQuery);
