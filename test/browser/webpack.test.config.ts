
'use strict'
import path from 'path'
import webpack from 'webpack'

const config: webpack.Configuration = {
    mode: 'none',
    devtool: 'inline-source-map',
    entry: path.resolve(__dirname, './mocha.runner.ts'),
    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'mocha.test.bundle.js',
    },
    node: {
        fs: 'empty',
    },
    target: 'web',
}

export default config
