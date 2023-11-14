import { TriggerInDTO } from '@core/dtos/trigger.dto';

export type RegisteredErrorDTO =
  | {
      isRegistered: false;
    }
  | {
      isRegistered: true;

      value: {
        /**
         * The catched exception.
         */
        error: any;
        /**
         * Represents the caller information for a logging event.
         *
         * @type {TriggerInDTO}
         */
        trigger: TriggerInDTO;

        /**
         * The parameters of the trigger.
         *
         * @type {any[]}
         */
        params: any[];

        title: string;
      };
    };
