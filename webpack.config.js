const path = require('path');
const cssExtracter = require('mini-css-extract-plugin');
const htmlPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

module.exports = env => {
  const isProd = env.production ? true : false;


  return {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
    },
    resolve: {
      fallback: {
        fs: false
      }
    },
  
    mode: isProd ? 'production' : 'development',
    module: {
      rules: [
        {
          test: /\.(scss|css)$/,
          use: [
            cssExtracter.loader,
            { loader: 'css-loader' },
            { loader: 'sass-loader' },
            { loader: 'postcss-loader' },
            { loader: 'import-glob-loader' },
          ]
        },
        {
          test: /\.(png|gif|jpeg|jpg|wow|wow2)$/,
          use:[
            {loader: 'file-loader'},
          ]
        },
        {
          test: /\.svg$/,
          use: [            
            {
              loader: 'svg-sprite-loader',
              options: {
                extract: true,
                spriteFilename: './sprite.svg',
              }
            },            
            {
              loader: 'svgo-loader',
              options:{
                plugins: [
                  {
                    name: 'removeAttrs',
                    params: {
                      attrs: '(fill|stroke|style|width|height|data.*)' 
                    }
                  }
                ]
              }
            },
          ]
        },
        { test: /\.handlebars$/, loader: "handlebars-loader" },
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new cssExtracter({
        filename: 'style.css'
      }),
      new htmlPlugin({
        template: './src/index.html',
        inject: 'body',
      }),
      new SpriteLoaderPlugin({
        plainSprite: true
      })
    ],
    devServer: {
      contentBase: path.join(__dirname,'dist'),
      liveReload: true,
      open: true,
    }
  }
}