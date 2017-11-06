import Config from 'Config';
import Store from './Store/Store';
import IndexedDBService from './IndexedDB/IndexedDB';

export default function RegisterServices () {

  IndexedDBService();

  angular
    .module(Config.APP_SERVICES, [])
    .factory('store', Store)
}