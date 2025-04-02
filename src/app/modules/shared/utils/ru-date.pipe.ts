import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ruDate',
  standalone: false,
})
export class RuDatePipe implements PipeTransform {
  transform(timestamp: number | null): string {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }
}
