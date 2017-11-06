import Config from 'Config';
import FilterByTags from './FilterByTags/FilterByTags';

export default function RegisterFilters () {
  angular
    .module(Config.APP_FILTERS, [])
    .filter('filterByTags', FilterByTags)
}