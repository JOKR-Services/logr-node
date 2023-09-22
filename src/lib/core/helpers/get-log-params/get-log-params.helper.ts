import { CommonOptions } from '@core/types';

export function getLogParams(
  args: any[],
  options?: Pick<CommonOptions, 'pipeParams' | 'hideParams'>
): any[] {
  if (!options) return args;

  if (options.hideParams) return ['WAS HIDDEN'];

  if (!options.pipeParams) return args;

  const pipped = options.pipeParams(...args);

  return Array.isArray(pipped) ? pipped : [pipped];
}
