var Webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");

var path = require("path");

var config = {
    cache: true,
    devtool: 'source-map',
    performance: {
        hints: false
    },
    devServer: {
        contentBase: path.resolve(__dirname, "public"),
        port: 8080
    },
    entry: {
        index: "./src/index.ts"
    },
    output: {
		path: path.resolve(__dirname, "public"),
		filename: "dist/[name].[hash].js",
		chunkFilename: "dist/[name].[id].[hash].chunk.js",
		publicPath: "/"
    },
    resolve: {
        extensions: [".ts", ".js", ".json", ".css", ".scss", ".html"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader"
            },
            {
                test: /\.(glsl|frag|vert)$/,
                loader: "raw!glslify"
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
			title: "Marvio Silverio",
			filename: "index.html",
			inject: "body",
			template: "src/index.html",
			production: process.argv.indexOf("pro") !== -1,
			minify: {
				removeAttributeQuotes: false,
				collapseWhitespace: true,
				minifyCSS: true,
				removeComments: true,
				removeEmptyAttributes: false
			}
		}),
        new Webpack.HotModuleReplacementPlugin()
    ]
};

module.exports = config;