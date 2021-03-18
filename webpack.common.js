const path = require('path');

module.exports = {
  entry: {
    app: './src/format.js',
  },
  module: {
    rules: [
      {
        exclude: [/node_modules/],
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
        }],
      },
    ],
  },
  output: {
    filename: 'danehansen-format.min.js',
    library: ['danehansen', 'format'],
    libraryTarget: 'umd',
    path: __dirname,
  },
}
