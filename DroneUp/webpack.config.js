var isDevBuild = process.argv.indexOf('--env.prod') < 0;
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var bundleOutputDir = './wwwroot/dist';

var babelSettings = {
	presets: ['es2015', 'react'],
	plugins: [
		'transform-class-properties',
		'transform-object-rest-spread',
		'transform-runtime'
	]
};

module.exports = {
	devtool: isDevBuild ? 'source-map' : null,
	entry: {
		'main': './ClientApp/main.tsx'		
	},
	resolve: { extensions: ['', '.js', '.jsx', '.ts', '.tsx', '.scss' ] },
	output: {
		path: path.join(__dirname, bundleOutputDir),
		filename: '[name].js',
		publicPath: '/dist/'
	},
	module: {
		loaders: [
			{ test: /\.jsx?$/, loaders: ['babel-loader?' + JSON.stringify(babelSettings) ], exclude: /node_modules[\\/](?!@duel)/	},
			{ test: /\.ts(x?)$/, include: /ClientApp/, loader: 'babel-loader' },
			{ test: /\.ts(x?)$/, loader: 'ts-loader', query: { silent: true }},
			{ test: /\.css$/, loader: ExtractTextPlugin.extract(['css-loader']) },
			{ test: /\.scss$/, loader: ExtractTextPlugin.extract('style-loader', [`css-loader`, 'postcss-loader', `sass-loader`]) },
			{ test: /\.(png|jpg|jpeg|gif|svg)$/, loader: 'url-loader', query: { limit: 25000 } },
			{ test: /\.json$/, loader: "json-loader" },
			{ test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
			{ test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
		]
	},
	postcss: ([ autoprefixer ]),
	plugins: [
		new ExtractTextPlugin('[name].css'),
		new webpack.optimize.CommonsChunkPlugin({name: "common"})
	].concat(isDevBuild ? [
		// Plugins that apply in development builds only
	] : [
		// Plugins that apply in production builds only
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.AggressiveMergingPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: { screw_ie8: true, warnings: false }
		})
	]),
	stats: {
		children: false
	}
};
