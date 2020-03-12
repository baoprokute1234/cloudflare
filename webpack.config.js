const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
require('@babel/register');
require('@babel/polyfill');

module.exports = function (env) {
  return {
    mode: env === 'production' ? 'production' : 'development',
    entry: {
      main: './view/index.js'
    },
    devtool: env === 'production' ? 'none' : 'inline-source-map',
    output: {
      filename: 'js/[name].js',
      path: path.join(__dirname, 'dist'),
      publicPath: '/'
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin(),
        new OptimizeCssAssetsPlugin({
          cssProcessorOptions: {
            discardComments: {
              removeAll: true
            }
          },
          canPrint: true
        })
      ]
    },
    resolve: {
      extensions: ['.scss', '.js', '.jsx', '.css']
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: [/node_modules/],
          loader: "babel-loader"
        },
        {
          test: /\.module\.s(a|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: true,
              }
            },
            'sass-loader',
          ]
        },
        {
          test: /\.s(a|c)ss$/,
          exclude: [/\.module\.s(a|c)ss$/, /\.scoped\.s(a|c)ss$/],
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
          ]
        },
        {
          test: /\.css$/,
          exclude: [/\.scoped\.css$/],
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader'
          ]
        },
        {
          test: /\.scoped\.s(a|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            // 'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                importLoaders: 2
              }
            },
            'scoped-css-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.scoped\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                importLoaders: 2,
              }
            },
            'scoped-css-loader',
          ]
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'assets/fonts/'
              }
            }
          ]
        },
        {
          test: /\.pug$/,
          loader: 'pug-loader'
        }
      ]
    },
    plugins: [
      new HtmlWebPackPlugin({
        inject: false,
        hash: true,
        template: path.join(__dirname, 'view/public/index.pug'),
        filename: 'index.template',
        favicon: path.join(__dirname, 'view/public/favicon.png'),
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css'
      }),
    ],
    devServer: {
      inline: true,
      port: 3001,
      historyApiFallback: true,
      contentBase: path.join(__dirname, 'dist'),
      publicPath: '/',
      compress: true,
    }
  }
}