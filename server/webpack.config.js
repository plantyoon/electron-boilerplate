const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const path = require('path');

const mode = process.env.NODE_ENV;

module.exports = {
  mode,
  entry: ['webpack-hot-middleware/client', './server/entry.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[hash].js',
  },
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: true,
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      
    ]
  },
  target: 'electron-renderer',
  devServer: {
    noInfo: true,
    inline: true,
    contentBase: [path.join(__dirname, 'src')],
    watchContentBase: true,
    hot: true,
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin({default: ['dist']}),
    new HtmlWebpackPlugin({template: 'template/index.html'}),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};