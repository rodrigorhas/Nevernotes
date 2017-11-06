import Config from 'Config';

function IndexedDBService () {
	angular
		.module('indexedDB', [])
		.service('$store', function ($timeout) {
			let indexedDB, IDBTransaction, IDBKeyRange;
			
			function configBrowser () {
				try {
					indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
					IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
					IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
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
						
						var request = indexedDB.open(Config.APP_NAME, 2);

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

				saveAudioFile: function (audio, blob) {
					var self = this;
					return new Promise (function (resolve, reject) {
						self.load().then(function (store) {
							var tx = store.transaction(['audio'], "readwrite");
							var objectStore = tx.objectStore('audio');

							var request = objectStore.add({name: audio.name, blob: blob});

							request.onsuccess = resolve;
							request.onerror = reject;
							tx.onerror = reject;
						});
					})
				},

				newTransaction: function (store) {
					var self = this;

					return new Promise (function (resolve, reject) {
						self.load().then(function (db) {
							var tx = db.transaction([store], "readwrite");
							var objectStore = tx.objectStore(store);

							tx.onerror = reject;

							resolve({store: objectStore, transaction: tx});
						})
					})
				},

				getAll: function (store) {
					var self = this;
					
					return new Promise (function (resolve, reject) {

						self.load().then(function (db) {
							self.newTransaction(store).then(function (response) {
								var store = response.store;
								var tx = response.transaction;

								var items = [];

								tx.oncomplete = function () {
									resolve(items);
								}

								store.openCursor().onsuccess = function(event) {
									var cursor = event.target.result;
									if (cursor) {
										items.push(cursor.value);
										cursor.continue();
									}
								};
							});
						});
					});
				}
			}
		});
}

export default IndexedDBService;