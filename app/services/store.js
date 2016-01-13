angular.module("App")
.factory('store', ["$http", "$timeout", function($http, $timeout) {
	var store = {};

	return {
		add: function (key, obj) {
			store[key] = obj;
			return store;
		},

		addToList: function (key, obj) {
			store[key].push(obj);
			return store;
		},

		remove: function (key) {
			delete store[key];
			return store;
		},

		get: function (key) {
			return store[key] || null;
		},

		loadData: function (key, fn) {
			var proxy = this.$$proxy.get(key),
				url = proxy ? proxy.all : "";

			$http({
				url: url,
				dataType: "json"
			})

			.then((response) => {
				$timeout(() => {
					this.$on.$dispatchEvent("load", key);
					this.add(key, response.data);
					if(fn) fn();
				});
			});
		},

		loadItem: function (key, pk, addToList, fn) {
			var proxy = this.$$proxy.get(key),
				url = proxy ? proxy.item + pk : "";

			$http({
				url: url,
				dataType: "json"
			})

			.then((response) => {
				$timeout(() => {
					if(addToList)
						this.addToList(key, response.data);

					if(fn) fn(response.data);
				});
			});
		},

		$on: {

			$dispatchEvent: function (type, key) {
				if(this._types[type][key]) {
					var args = Array.prototype.slice.call(arguments);
					args = args.slice(2);
					this._types[type][key]._listeners.forEach((listener) => listener.apply(null, args));
				}
			},

			_types: {
				load: {}
			},

			load: function (key, fn) {
				if(!this._types.load[key])
					this._types.load[key] = {_listeners: []};

				this._types.load[key]._listeners.push(fn);
			}
		},

		$data: store,

		$$proxy: {
			items: {},

			add: function (key, config) {
				this.items[key] = config;
				return this;
			},

			remove: function (key) {
				delete this.items[key];
			},

			get: function (key) {
				return this.items[key] || null;
			}
		}
	};
}]);