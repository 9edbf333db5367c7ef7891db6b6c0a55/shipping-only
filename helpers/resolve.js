const path = require('path');

module.exports = function resolve() {
  return path.join(__dirname, '..', ...Array.from(arguments));
};
