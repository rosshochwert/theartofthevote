require('dotenv').config();

const webpack = require('webpack');

module.exports = {
  entry: './src/js/scripts.js',
  output: {
    path: __dirname + '/src',
    filename: 'bundle.js'
  },
  resolve: {
    modules: ['node_modules']
  },
  plugins: [
    new webpack.DefinePlugin({
      LAMBDA_ENDPOINT: JSON.stringify(process.env.LAMBDA_ENDPOINT),
      STRIPE_PUBLISHABLE_KEY: JSON.stringify(process.env.STRIPE_PUBLISHABLE_KEY),
    })
  ]
}