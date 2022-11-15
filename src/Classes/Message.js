/**
 * @file Custom message interpolator class.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

/**
 * @class
 * @description Message manager.
 */
class Message {
  /**
   * @constructs Message
   * @description Replaces mustaches interpolations with corresponding given values.
   *
   * @param { string }                          message        - The message containing mustaches.
   * @param { Object<string, (number|string)> } interpolations - Map of available interpolations variables.
   *
   * @example
   * const { message } = new Message(
   *   'This is a {{ adjective }} message !',
   *   { adjective: 'nice' },
   * );
   * console.log(message); // 'This is a nice message !'
   */
  constructor(message, interpolations) {
    this.message = message;

    const availableInterpolations =
      message.match(/({{[^a-z_]?[a-z_]+[^a-z_]?}})/gim) ?? [];

    availableInterpolations.forEach((availableInterpolation) => {
      const interpolationName = availableInterpolation.replace(
        /([^a-zA-Z_]||[ {}])+/g,
        '',
      );

      if (!interpolations[interpolationName]) return;

      this.message = this.message.replaceAll(
        availableInterpolation,
        String(interpolations[interpolationName]),
      );
    });
  }
}

export default Message;
