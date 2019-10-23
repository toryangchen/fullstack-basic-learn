const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
// html-webpack-plugin
// 会在打包结束后自动生成html文件，
// 并把打包生成的js文件自动引入到该html文件中

module.exports = {
	mode: 'development',
	entry: {
		main: './src/index.js'
	},
	module: {
		rules: [{
				test: /\.(jpg|png|gif)$/,
				use: {
					loader: 'url-loader',
					options: {
						name: '[name]_[hash].[ext]',
						outputPath: 'images/',
						limit: 10240
					}
				}
		}, {
				test: /\.(eot|ttf|svg|woff)$/,
				use: {
					loader: 'file-loader',
				}
		},
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							importLoaders: 2,
							// modules: true,
						}
					},
					'sass-loader',
					'postcss-loader'
				]
		}]
	},
	plugins: [new HtmlWebpackPlugin({
		template: 'src/public/index.html'
	})],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	}
}