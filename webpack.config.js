'use strict';
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
module.exports = {
    mode:'development',
    devtool: 'inline-source-map', // 正式环境使用 ''
	entry: './src/index.ts',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.vue', '.json'],
        alias: {
            '@': path.resolve(__dirname, './src'),
            'PUBLIC':path.resolve(__dirname,'./public')
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(le|c)ss$/,
                use:[
                    'style-loader',
                    'css-loader',
                    'less-loader',
                ]
            },
            {
                test: /\.s(c|a)ss$/,
                use: [
                  'vue-style-loader',
                  'css-loader',
                  {
                    loader: 'sass-loader',
                    // Requires sass-loader@^7.0.0
                    options: {
                      implementation: require('sass'),
                      indentedSyntax: true // optional
                    },
                    // Requires sass-loader@^8.0.0
                    options: {
                      implementation: require('sass'),
                      sassOptions: {
                        indentedSyntax: true // optional
                      },
                    },
                  },
                ],
              },
        
        ]
    },
    resolve: {
        extensions: [ '.ts', '.tsx', '.js' ]
    },
    devServer:{
        // 设计开发环境静态文件代理文件夹，设置后可以通过 localhost:8080/index.js 可以访问
        contentBase:path.resolve(__dirname, 'public'),
    },
    plugins: [
        new HtmlWebpackPlugin({
          title: 'simplest ts environment',
          template:'index.html'
        }),
        // 设置插件后可以热更新文件
        new webpack.HotModuleReplacementPlugin(),
        new VueLoaderPlugin(),

    ],
};
