const express = require('express');
const webpack = require('webpack');
const webpackDevMiddle = require('webpack-dev-middleware');
const config = require('./webpack.config');
const compiler = webpack(config);

const app = express();
app.use(webpackDevMiddle(compiler, {
	publicPath: config.output.publicPath
}));


app.listen(3000, () => {
	console.log('server running ');
})