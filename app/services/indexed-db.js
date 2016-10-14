angular
	.module('indexedDB', [])
	.service('$store', function ($timeout) {
		function configBrowser () {
			try {
				// Na linha abaixo, você deve incluir os prefixos do navegador que você vai testar.
				window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
				// Não use "var indexedDB = ..." se você não está numa function.
				// Posteriormente, você pode precisar de referências de algum objeto window.IDB*:
				window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
				window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
				// (Mozilla nunca usou prefixo nesses objetos, então não precisamos window.mozIDB*)
			}

			catch (e) {
				console.error(e);
			}
		}

		return {
			db: null,

			handleDatabaseError: function () {
				console.error("Database error: " + event.target.errorCode);
			},

			load: function () {
				var self = this;

				return new Promise(function (resolve, reject) {
					
					if(self.db) return resolve(self.db);

					configBrowser();
					
					var request = window.indexedDB.open("Nevernotes", 2);

					request.onerror = reject;

					request.onsuccess = function(event) {
					  self.db = request.result;

					  self.db.onerror = self.handleDatabaseError;

					  resolve(self.db);
					};

					request.onupgradeneeded = function(event) { 
						console.log('write');
					  var db = event.target.result;

					  // cria um objectStore para esse banco
					  var objectStore = db.createObjectStore("audio", { autoIncrement: true });

					  objectStore.createIndex("name", "name", {unique: true});
					  objectStore.createIndex("blob", "blob", {});
					};
				});
			},

			insert: function () {

			},

			getAll: function (store) {
				var self = this;
				
				return new Promise (function (resolve, reject) {

					self.load().then(function (db) {
						var tx = db.transaction([store], "readwrite");
						var objectStore = tx.objectStore(store);
						var items = [];

						tx.onerror = reject;
						tx.oncomplete = function () {
							resolve(items);
						}

						objectStore.openCursor().onsuccess = function(event) {
						  var cursor = event.target.result;
						  if (cursor) {
						    items.push(cursor.value);
						    cursor.continue();
						  }
						};
					});
				});
			}
		}
	});