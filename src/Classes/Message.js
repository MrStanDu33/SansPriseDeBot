export default class Message {
  constructor(message, interpolations) {
    // get all interpolations
    // get all variables
    // for each interpolation that exists in variables
    // replace interpolation with variable
    this.message = message;

    // eslint-disable-next-line operator-linebreak
    const availableInterpolations =
      message.match(/({{[^a-z_]?[a-z_]+[^a-z_]?}})/gim) ?? [];

    availableInterpolations.forEach((availableInterpolation) => {
      const interpolationName = availableInterpolation.replace(/[ {}]+/g, '');
      if (!interpolations[interpolationName]) return;

      this.message = this.message.replace(
        availableInterpolation,
        interpolations[interpolationName],
      );
    });
  }
}
