/**
 * Created by HVELK on 2017/2/23.
 */
var path=require("path");
var webpack=require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports={
    entry:{
        HVE:"./main.js"
    },
    output:{
        path:path.join(__dirname,"dist"),
        filename:"[name].js",
        /*publicPath:"./dist/"*/
    },
    plugins:[
        new webpack.optimize.CommonsChunkPlugin({
            name:"common",
            chunks :["HVE"],
            children:false
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap:true,
            mangle:true,
            beautify:true
        }),
        new ExtractTextPlugin({
            filename:"./dist/style/[name].css"
        }),
        new HtmlWebpackPlugin({
            title:"HVE",
            filename:"./main.html",
            template:"./index.html",
            inject:true,
            hash:false,
            minify:{
                removeComments:true,    //移除HTML中的注释
                collapseWhitespace:false    //删除空白符与换行符
            }
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                devService: {
                    contentBase:"./dist",
                    historyApiFallback:true,
                    hot:true,
                    inline:true,
                    progress:true
                }
        }
    })],
    module:{
        loaders:[
/*            { test: /\.css$/, loader: ExtractTextPlugin.extract({
                fallback: 'style-loader', use: 'css-loader'
            }) },*/
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'},
            { test: /\.scss$/, loader: 'style!css!sass?sourceMap'}
            ]
    }
};
