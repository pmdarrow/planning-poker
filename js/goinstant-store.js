var app = app || {};

(function ($) {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }

  function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  }

  app.GoInstantStore = function(url, room, callback) {
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
        callback(_.bind(this.sync, this));
      }, this));
    }, this));
  };

  _.extend(app.GoInstantStore.prototype, {
    getKey: function(model) {
      return this.room.key(model.collection.goInstantKey + '/' + model.id);
    },

    setKey: function(model, options) {
      this.getKey(model).set(JSON.stringify(model), function(err) {
        if (err) {
          return options.error('Error setting GoInstant key: ' + err);
        }
        console.log('Successfully set key');
        return options.success(model);
      });
    },

    find: function(model, options) {
      console.log('find not implemented');
    },

    findAll: function(collection, options) {
      var key = this.room.key(collection.goInstantKey);
      key.get(function(err, value, context) {
        if (err) {
          return options.error('Error fetching GoInstantKey: ' + err);
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

    delete: function(model, options) {
      console.log('delete not implemented');
    },

    sync: function(method, model, options) {
      console.log('Sync:', method, model, options);

      switch (method) {
        case "read":
          model.id != undefined ? this.find(model, options) :
            this.findAll(model, options);
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
