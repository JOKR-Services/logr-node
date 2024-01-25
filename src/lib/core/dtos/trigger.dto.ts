/**
 * Represents a trigger for a logging operation.
 *
 * @property {string} name - The name of the class/function where the logging event occurred.
 * @property {string} method_name - The name of the method where the logging event occurred.
 * @property {unknown} params - The parameters of the trigger (type unknown).
 */
export type TriggerOutDTO = {
  /**
   * The name of the class/function where the logging event occurred.
   *
   * @type {string}
   */
  name: string;

  /**
   * The name of the method where the logging event occurred.
   *
   * @type {string}
   */
  method_name?: string | undefined;

  /**
   * The parameters of the trigger (type unknown).
   *
   * @type {unknown}
   */
  params: unknown;
};

/**
 * Represents the caller information for a logging event.
 *
 * @property {string} className - The name of the class where the logging event occurred.
 * @property {string} methodName - The name of the method where the logging event occurred.
 * @property {string} kind - The kind of logging event (e.g., 'Application', 'Domain', 'Infra').
 */
export type TriggerInDTO = {
  /**
   * The name of the class where the logging event occurred.
   *
   * @type {string}
   */
  className: string;

  /**
   * The name of the method where the logging event occurred.
   *
   * @type {string}
   */
  methodName?: string;

  /**
   * The kind of logging event (e.g., 'Application', 'Domain', 'Infra').
   *
   * @type {string}
   */
  kind?: string;
};
