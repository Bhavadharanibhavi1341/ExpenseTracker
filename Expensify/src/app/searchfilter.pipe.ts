import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchfilter',
})
export class SearchfilterPipe implements PipeTransform {
  transform(userList: any[], searchValue: string): any[] {
    if (!userList || !searchValue) {
      return userList;
    }
    return userList.filter((user) =>
      user.UserName.toLowerCase().includes(searchValue)
    );
  }
}
