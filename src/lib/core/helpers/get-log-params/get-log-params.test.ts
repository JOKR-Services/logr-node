import { getLogParams } from './get-log-params.helper';

describe('getLogParams', () => {
  it('should return params pipped object if the pipeParams option is defined', () => {
    const args = [true, { foo: 'bar' }, 12];
    const expected = { active: args[0], address: args[1], age: args[2] };
    const pipeParams = jest.fn().mockImplementation(() => expected);

    const result = getLogParams(args, { pipeParams });

    expect(result).toMatchObject([expected]);
    expect(pipeParams).toBeCalledWith(...args);
    expect(pipeParams).toBeCalledTimes(1);
  });

  it('should return params pipped array if the pipeParams option is defined', () => {
    const args = [true, { foo: 'bar' }, 12];
    const expected = [{ active: args[0] }, { address: args[1] }, { age: args[2] }];
    const pipeParams = jest.fn().mockImplementation(() => expected);

    const result = getLogParams(args, { pipeParams });

    expect(result).toMatchObject(expected);
    expect(pipeParams).toBeCalledWith(...args);
    expect(pipeParams).toBeCalledTimes(1);
  });

  it('should return empty array if the hideParams options is true', () => {
    const args = [true, { foo: 'bar' }, 12];
    const result = getLogParams(args, { hideParams: true });

    expect(result).toStrictEqual(['WAS HIDDEN']);
  });

  it('should return original params if options is undefined', () => {
    const args = [true, { foo: 'bar' }, 12];
    const result = getLogParams(args);

    expect(result).toStrictEqual(args);
  });

  it('should return original params if pipeParams is undefined', () => {
    const args = [true, { foo: 'bar' }, 12];
    const result = getLogParams(args, { hideParams: false });

    expect(result).toStrictEqual(args);
  });
});
