const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {

  watch: true,
  context: __dirname,

  resolve: {
    alias: {
      Utils: path.resolve(__dirname, 'src/js/utils/'),
      Services: path.resolve(__dirname, 'src/js/services/'),
      Filters: path.resolve(__dirname, 'src/js/filters/'),
      Factories: path.resolve(__dirname, 'src/js/factories/'),
      Components: path.resolve(__dirname, 'src/js/components/'),
      Controllers: path.resolve(__dirname, 'src/js/controllers/'),
      Config$: path.resolve(__dirname, 'src/js/config.js'),
    }
  },

  entry: {
    app: ['./src/js/App.js', './src/sass/main.scss'],
  },
  
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Nevernotes',
      template: path.resolve(__dirname, 'src/views/index.jade'),
    }),
    new ManifestPlugin(),
    new ExtractTextPlugin({
      filename: 'css/[name].bundle.css',
      allChunks: true,
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(sass|scss)$/,
        loader: ExtractTextPlugin.extract([
          {loader: 'css-loader', options: { minimize: true }},
          'sass-loader'
        ])
      },

      { test: /\.jade$/, loader: 'jade-loader' },
  
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: [
            'babel-preset-es2015',
            'babel-preset-env'
          ],
        }
      }
    ],
  },

  stats: {
    colors: true
  },

  devtool: 'source-map',

  output: {
    filename: 'js/[name].bundle-[hash].js',
    path: path.resolve(__dirname, 'dist')
  }
};