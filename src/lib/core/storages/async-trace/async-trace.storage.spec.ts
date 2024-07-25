import { AsyncTrace } from '@core/types';

import { AsyncTraceStorage } from './async-trace.storage';

describe('AsyncTraceStorage', () => {
  const args: AsyncTrace = { correlationId: 'a', causationId: 'b' };
  const fn = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('run', () => {
    it('calls callback function', () => {
      AsyncTraceStorage.run(args, () => {
        fn();
      });

      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('outsideAsyncContext', () => {
    it('returns true when outside async context', () => {
      expect(AsyncTraceStorage.outsideAsyncContext).toBe(true);
    });

    it('returns false when inside async context', () => {
      AsyncTraceStorage.run({}, () => {
        expect(AsyncTraceStorage.outsideAsyncContext).toBe(false);
      });
    });
  });

  describe('correlationId', () => {
    describe('get', () => {
      it('returns undefined when outside async context', () => {
        expect(AsyncTraceStorage.correlationId).toBeUndefined();
      });

      it('returns false when inside async context', () => {
        AsyncTraceStorage.run(args, () => {
          expect(AsyncTraceStorage.correlationId).toEqual(args.correlationId);
        });
      });
    });

    describe('set', () => {
      it('cannot change when outside async context', () => {
        AsyncTraceStorage.correlationId = '1234';

        expect(AsyncTraceStorage.correlationId).toBeUndefined();
      });

      it('changes when inside async context', () => {
        AsyncTraceStorage.run(args, () => {
          AsyncTraceStorage.correlationId = '1234';

          expect(AsyncTraceStorage.correlationId).toEqual('1234');
        });
      });
    });
  });

  describe('causationId', () => {
    describe('get', () => {
      it('returns undefined when outside async context', () => {
        expect(AsyncTraceStorage.causationId).toBeUndefined();
      });

      it('returns false when inside async context', () => {
        AsyncTraceStorage.run(args, () => {
          expect(AsyncTraceStorage.causationId).toEqual(args.causationId);
        });
      });
    });

    describe('set', () => {
      it('cannot change when outside async context', () => {
        AsyncTraceStorage.causationId = '1234';

        expect(AsyncTraceStorage.causationId).toBeUndefined();
      });

      it('changes when inside async context', () => {
        AsyncTraceStorage.run(args, () => {
          AsyncTraceStorage.causationId = '1234';

          expect(AsyncTraceStorage.causationId).toEqual('1234');
        });
      });
    });
  });
});
