import { NgModule, Pipe, PipeTransform } from '@angular/core';

export function formatPhone(value) {
  return String(value).replace(/(\d{2})(\d{5})(\d{4})/, '($1)$2-$3');
}

@Pipe({
  name: 'phone',
})
export class PhonePipe implements PipeTransform {
  transform(value: number): any {
   return formatPhone(value);
  }
}

@NgModule({
  imports: [],
  providers: [],
  exports: [PhonePipe],
  declarations: [PhonePipe],
})
export class PhonePipeModule { }
