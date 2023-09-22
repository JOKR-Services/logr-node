export type CommonOptions = {
  /**
   * @description The kind of logging event (e.g., 'Application', 'Domain', 'Infra') (optional).
   *
   * @type {string}
   */
  kind?: string;

  /**
   * @description Defines whether the method is synchronous (optional).
   *
   * @type {boolean}
   */
  isSync?: boolean;

  /**
   * @description If set to true, the parameters that have been passed to the method will not be recorded, keeping sensitive data private. (optional).
   *
   * @type {boolean}
   */
  hideParams?: boolean;

  /**
   * @description It allows you to use a function to process and transform the parameters before they are recorded, adapting them to the desired format. (optional).
   *
   * @type {Function}
   * @param {any[]} ...params = All parameters in the same order as they were declared in method or function
   * @returns {any} - The new parameters to be logged.
   */
  pipeParams?: (...params: any[]) => any;
};
