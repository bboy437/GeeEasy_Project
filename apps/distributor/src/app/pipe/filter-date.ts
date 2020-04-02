import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'FilterDate'
})

export class FilterDate implements PipeTransform {
    transform(items: any[], startdate: number, enddate: number, value): any[] {
        if (!items) return [];
        if (!startdate) return items;
        if (!enddate) return items;

        return items.filter(it => {
            return it[value] >= startdate && it[value] <= enddate;
        });
    }
}