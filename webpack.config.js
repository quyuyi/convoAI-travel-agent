var path = require('path');
module.exports = {
    mode: 'development',
    entry: [
        path.resolve('./src/index.jsx')
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },{
                test: /\.(jpe?g|png|gif|mp3)$/i,
                loaders: ['file-loader']
            }, 
            {
                test: path.join(__dirname, '.'),
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env',
                              '@babel/react',{
                              'plugins': ['@babel/plugin-proposal-class-properties']}]
                }
            }
        ]
    },
    output: {
        path: __dirname + '/static',
        filename: 'bundle.js'
    },
    watchOptions: {
        poll: true,
        ignored: /node_modules/
    }
};