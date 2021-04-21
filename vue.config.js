// const GoogleFontsPlugin = require("google-fonts-webpack-plugin")
// const Typograf = require('typograf');
const path = require('path');
const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin');
const {styles} = require('@ckeditor/ckeditor5-dev-utils');

module.exports = {
    "transpileDependencies": [
        /ckeditor5-[^/\\]+[/\\]src[/\\].+\.js$/,
    ],
    chainWebpack: config => {
        const svgRule = config.module.rule('svg');
        svgRule.exclude.add(
            path.join(__dirname, 'node_modules', '@ckeditor')
        );
        svgRule.exclude.add(
            path.join(__dirname+"/src/assets")
        );
        config.module
            .rule('cke-svg')
            .test(/theme[/\\]icons[/\\][^/\\]+\.svg$/)
            .use('raw-loader')
            .loader('raw-loader');
        config.module
            .rule('my-cke-svg')
            .test(/src[/\\]assets[/\\][^/\\]+\.svg$/)
            .use('raw-loader')
            .loader('raw-loader');
        config.module
            .rule('cke-css')
            .test(/ckeditor5-[^/\\]+[/\\].+\.css$/)
            .use('postcss-loader')
            .loader('postcss-loader')
            .tap(() => {
                return styles.getPostCssConfig({
                    themeImporter: {
                        themePath: require.resolve('@ckeditor/ckeditor5-theme-lark'),
                    },
                    minify: true
                });
            });
    },
    devServer: {
        port: 4044,
    },
    runtimeCompiler: true,
    configureWebpack: {
        resolve: {
            extensions: ['.js', '.vue', '.json'],
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                '@': path.resolve(__dirname, "src"),
            }
        },
        plugins: [
            new CKEditorWebpackPlugin({
                // language: 'ru',
                // additionalLanguages: 'all',
                // translationsOutputFile: /app/
            }),
        ],
    },
};