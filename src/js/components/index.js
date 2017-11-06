import Icon from './Icon';
import ButtonClass from './ButtonClass';
import AutoGrow from './AutoGrow';
import AutoFocus from './AutoFocus';
import TagAutocomplete from './TagAutocomplete';
import Config from 'Config';

export default function RegisterComponents () {
  angular
    .module(Config.APP_COMPONENTS, [])
    .directive('autofocus', AutoFocus)
    .directive('autoGrow', AutoGrow)
    .directive('btn', ButtonClass)
    .directive('icon', Icon)
    .directive('tagAutocomplete', TagAutocomplete)
}