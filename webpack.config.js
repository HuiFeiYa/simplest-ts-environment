'use strict';
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')
module.exports = {
    mode:'development',
    devtool: 'inline-source-map', // 正式环境使用 ''
	entry: './src/index.ts',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist')
	},
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: [ '.ts', '.tsx', '.js' ]
    },
    devServer:{
        // 设计静态文件代理文件夹，设置后可以通过 localhost:8080/index.js 可以访问
        contentBase:path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
          title: 'simplest ts environment',
          template:'index.html'
        }),
        // 设置插件后可以热更新文件
        new webpack.HotModuleReplacementPlugin()
    ],
};
