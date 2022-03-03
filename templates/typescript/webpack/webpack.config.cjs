const path = require('path');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode,
  entry: {
    index: path.resolve(__dirname, '../src/index.tsx')
  },
  output: {
    path: path.resolve(__dirname, '../public'),
    filename: '[name].[contenthash].js',
    assetModuleFilename: '[name][ext]',
    clean: true,
    publicPath: '/'
  },
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    port: 1234,
    open: true,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx',
          target: 'es2015'
        }
      },
      {
        test: /\.s(a|c)ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpe?g|gif|woff)$/,
        type: 'asset/resource'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx']
  },
  plugins: [
    new HTMLWebpackPlugin({
      filename: 'index.html',
      title: 'thom app',
      inject: 'body',
      template: path.resolve(__dirname, './template/index.html')
    })
  ],
  optimization: {
    minimizer: [
      new ESBuildMinifyPlugin({
        target: 'es2015',
        css: true
      })
    ]
  }
};
