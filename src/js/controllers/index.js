import Config from 'Config';
import MainController from './Main/Main';

export default function RegisterControllers () {
  angular
    .module(Config.APP_CONTROLLERS, [])
    .controller('Main', MainController)
}