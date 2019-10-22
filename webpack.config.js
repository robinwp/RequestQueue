const path = require('path');

const build = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'request-queue.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'window',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
};

module.exports = [build, Object.assign({}, build, {
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'RequestQueue',
    libraryTarget: 'umd',
  },
})];
