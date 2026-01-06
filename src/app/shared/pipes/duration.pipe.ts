import {Pipe, PipeTransform} from '@angular/core';
import {formatDuration} from '../../core/utils/file-utils';

@Pipe({
  name: 'duration',
  standalone: true
})
export class DurationPipe implements PipeTransform {
  transform(value: number): string {
    return formatDuration(value);
  }
}
