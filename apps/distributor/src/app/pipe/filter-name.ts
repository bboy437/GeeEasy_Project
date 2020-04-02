import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'FilterName'
})

export class FilterName implements PipeTransform {
    transform(items: any[], searchText: string, value): any[] {
        if (!items) return [];
        if (!searchText) return items;
        searchText = searchText.toLowerCase();
        return items.filter(it => {
            return it[value].toLowerCase().includes(searchText);
        });
    }
}