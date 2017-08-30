const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require('path');
const extractLESS = new ExtractTextPlugin('./[name].css');

module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html'
        }),
        extractLESS
    ],
    entry: './main.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'main.bundle.js'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: ['style-loader', 'css-loader'] },
            { test: /\.less$/, loader: ['style-loader!css-loader!less-loader?sourceMap'] },
            // { test: /\.(png|jpe?g|gif|svg)(\?.*)?$/, loader: 'url-loader?name=images/[name].[ext]', },
            // { test: /\.html$/, loader: 'html-withimg-loader' },
        ],
        rules: [{
                test: /\.less$/i,
                use: extractLESS.extract(['css-loader', 'less-loader'])
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'url-loader'
                ]
            }
        ],
    },
    devServer: {
        contentBase: './dist'
    }
}