const path = require('path');

/**
 * This should be moved to its own separate "app".
 */
module.exports = {
    webpack: {
        configure: {
            target: 'web',
            entry: {
                main: './src/auth/index.tsx',
            },
            output: {
                filename: '[name].js',
            },
            externals: {
                "electron": "electron",
                "electron-builder": "electron-builder",
            },
        },
        configure: (webpackConfig, { env, paths }) => { 
            paths.appBuild = webpackConfig.output.path = path.resolve('build-auth');
            return webpackConfig;
        }
    }
};