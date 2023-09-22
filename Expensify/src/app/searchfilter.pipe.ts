import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchfilter',
})
export class SearchfilterPipe implements PipeTransform {
  transform(userList: any[], searchValue: string): any[] {
    if (!userList) {
      return [];
    }

    let filteredList = userList;

    if (searchValue) {
      filteredList = filteredList.filter((user) =>
        user.UserName.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    return filteredList.sort((a, b) => a.UserName.localeCompare(b.UserName));
  }
}
