import { DurationPipe} from './duration.pipe';
import {describe, expect} from 'vitest';


describe.only('DurationPipe', () => {
  const pipe = new DurationPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform seconds to mm:ss format', () => {
    expect(pipe.transform(65)).toBe('1:05');
    expect(pipe.transform(125)).toBe('2:05');
    expect(pipe.transform(9)).toBe('0:09');
  });

  it('should return 00:00 for 0 or null', () => {
    expect(pipe.transform(0)).toBe('0:00');
  })
})


