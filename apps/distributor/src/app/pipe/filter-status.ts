import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'FilterStatus'
})

export class FilterStatus implements PipeTransform {
    transform(items: any[], searchText: string, value): any[] {
        if (!items) return [];
        if (!searchText) return items;
        searchText = searchText.toLowerCase();
        const keyArray = value.split(",");
        return items.filter(it => {
            const check_a = it[keyArray[0]].toString();
            const check_b = it[keyArray[1]].toString();
            return check_a.toLowerCase().includes(searchText) || check_b.toLowerCase().includes(searchText);
        });
    }
}