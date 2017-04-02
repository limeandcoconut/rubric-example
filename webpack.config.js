const webpack = require('webpack');

module.exports = {
    devtool: '#eval-source-map',
    entry: [
        './client/assets/js/main.js',
        './client/assets/scss/main.scss',
    ],
    output: {
        path: 'public/build',
        publicPath: '/build/',
        filename: 'all.min.js',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            }, {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader'],
            }, {
                test: /\.md$/,
                loader: 'html!markdown-loader',
            }, {
                test: /\.json$/,
                loader: 'json-loader',
            },
        ],
    },
    node: {
        fs: 'empty',
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'client-vendor-bundle.js',
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
    ],
};
