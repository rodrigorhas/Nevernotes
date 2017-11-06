// import Router from './routes/router';
import RegisterFilters from 'Filters';
import RegisterComponents from 'Components';
import RegisterControllers from 'Controllers';
import RegisterServices from 'Services';

import Config from 'Config';

angular
  .module(Config.APP_NAME, [
    'ngStorage',
    'ngTouch',
    'ngSanitize',
    'indexedDB',
    Config.APP_FILTERS,
    Config.APP_SERVICES,
    Config.APP_COMPONENTS,
    Config.APP_CONTROLLERS,
  ])
  .run(function ($localStorage) {
    if(!$localStorage["nevernotes-store"]) {
      $localStorage["nevernotes-store"] = [];
    }
  
    if(!$localStorage['nevernotes-config']) {
      $localStorage['nevernotes-config'] = {
        debugMode: false,
        enterOption: false,
        quota: {}
      }
    }
  
    if(!$localStorage['nevernotes-tags']) {
      $localStorage['nevernotes-tags'] = [];
    }
  })
  // .config(Router);

RegisterFilters();
RegisterServices();
RegisterComponents();
RegisterControllers();