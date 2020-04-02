import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "nospace"
})
export class NospacePipe implements PipeTransform {
  transform(value: any): any {
    return value ? value.replace(/\s*/g, "") : value;
  }
}
