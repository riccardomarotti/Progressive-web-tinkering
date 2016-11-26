var path = require('path');
var webpack = require('webpack');
var filesystem  = require("fs");

module.exports = {
    entry: ["./app"],
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    },

    devServer: {
      watch: true,
      inline: true
    },

    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: 'jquery',
            "window.jQuery": 'jquery'
        })
    ],

    module: {
        preLoaders:[
            {
                test: /\.(js|es6)$/,
                exclude: /(node_modules)/,
                loader: "jshint-loader"
            }
        ],
        loaders: [
            {
                test: /\.es6$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.css/,
                exclude: /node_modules/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.(png|jpg|gif|ttf|eot|woff|woff2|svg|ico)/,
                exclude: /node_modules/,
                loader: 'url-loader?limit=100000'
            }
        ]
    },

    resolve: {
        extensions: ['', '.js', '.es6']
    },

    watch: false
}
