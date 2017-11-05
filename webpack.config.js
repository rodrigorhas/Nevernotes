const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {

  resolve: {
    alias: {
      Utils: path.resolve(__dirname, 'src/js/utils/'),
      Services: path.resolve(__dirname, 'src/js/services/'),
      Factories: path.resolve(__dirname, 'src/js/factories/'),
      Components: path.resolve(__dirname, 'src/js/components/'),
      Controllers: path.resolve(__dirname, 'src/js/controllers/'),
    }
  },

  entry: {
    app: './src/App.js',
  },
  
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Output Management'
    }),
    new ManifestPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          },
          {
            loader: "sass-loader" // compiles Sass to CSS
          }
        ]
      },
  
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
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};