/* eslint-disable import/no-extraneous-dependencies */
const babel = require('@babel/core')
const jestPreset = require('babel-preset-jest')

module.exports = {
  process(src, filename) {
    return babel.transform(src, {
      filename,
      presets: [jestPreset],
      retainLines: true
    }).code
  }
}
