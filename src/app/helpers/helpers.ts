import { Filters } from '../models/filters.model';

export function transformStringInArray(filters: string) {
  return filters
    .substring(1)
    .split('&')
    .map((param) => {
      const [attr, value] = param.split('=');
      return { attr, value };
    });
}

export function transformAttributesInParams(filters: Filters[]) {
  return filters.reduce((acc, filter, index) => {
    const prefix = index === 0 ? '?' : '&';
    return `${acc}${prefix}${filter.attr}=${filter.value}`;
  }, '');
}
