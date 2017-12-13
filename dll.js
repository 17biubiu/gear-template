var path = require('path');
var cooking = require('cooking');
var webpack = require('webpack');
var config = require('./build/config');
var md = require('markdown-it')();
var CopyWebpackPlugin = require('copy-webpack-plugin');
var striptags = require('./build/strip-tags');
var slugify = require('transliteration').slugify;
var isProd = process.env.NODE_ENV === 'production';

var base = process.cwd();

function convert(str) {
    str = str.replace(/(&#x)(\w{4});/gi, function ($0) {
        return String.fromCharCode(parseInt(encodeURIComponent($0).replace(/(%26%23x)(\w{4})(%3B)/g, '$2'), 16));
    });
    return str;
}

cooking.set({
    entry: {
        dll: ["./src/docs/index.js"]
    },
    dist: './manifest/',
    library: '[name]',
    publicPath: process.env.CI_ENV || '',
    // hash: true,
    minimize: true,
    extractCSS: true,
    alias: config.alias,
    extends: ['vue2'],
    postcss: config.postcss
});

// fix publicPath
if (!process.env.CI_ENV) {
    cooking.add('output.publicPath', '');
}

cooking.add('loader.js', {
    test: /\.js$/,
    loader: 'babel-loader'
});
cooking.add('loader.md', {
    test: /\.md$/,
    loader: 'vue-markdown-loader'
});

cooking.add('loader.scss', {
    test: /\.scss$/,
    loaders: ['style-loader', 'css-loader', 'sass-loader']
});

cooking.add(
    'output.chunkFilename',
    isProd ? '[name].[chunkhash:7].js' : '[name].js'
    // '[name].js'
);

cooking.add('vueMarkdown', {
    use: [
        [require('markdown-it-anchor'), {
            level: 2,
            slugify: slugify,
            permalink: true,
            permalinkBefore: true
        }],
        [require('markdown-it-container'), 'demo', {
            validate: function (params) {
                return params.trim().match(/^demo\s*(.*)$/);
            },

            render: function (tokens, idx) {
                var m = tokens[idx].info.trim().match(/^demo\s*(.*)$/);
                if (tokens[idx].nesting === 1) {
                    var description = (m && m.length > 1) ? m[1] : '';
                    var content = tokens[idx + 1].content;
                    var html = convert(striptags.strip(content, ['script', 'style'])).replace(/(<[^>]*)=""(?=.*>)/g, '$1');
                    var script = striptags.fetch(content, 'script');
                    var style = striptags.fetch(content, 'style');
                    var jsfiddle = {
                        html: html,
                        script: script,
                        style: style
                    };
                    var descriptionHTML = description ?
                        md.render(description) :
                        '';

                    jsfiddle = md.utils.escapeHtml(JSON.stringify(jsfiddle));

                    return `<demo-block class="demo-box" :jsfiddle="${jsfiddle}">
                      <div class="source" slot="source">${html}</div>
                      ${descriptionHTML}
                      <div class="highlight" slot="highlight">`;
                }
                return '</div></demo-block>\n';
            }
        }],
        [require('markdown-it-container'), 'tip'],
        [require('markdown-it-container'), 'warning']
    ],
    preprocess: function (MarkdownIt, source) {
        MarkdownIt.renderer.rules.table_open = function () {
            return '<table class="table">';
        };
        MarkdownIt.renderer.rules.fence = wrap(MarkdownIt.renderer.rules.fence);
        return source;
    }
});

var wrap = function (render) {
    return function () {
        return render.apply(this, arguments)
            .replace('<code v-pre class="', '<code class="hljs ')
            .replace('<code>', '<code class="hljs">');
    };
};

// if (isProd) {
//     cooking.add('externals.vue', 'Vue');
//     cooking.add('externals.vue-router', 'VueRouter');
// }

cooking.add('plugin.DllPlugin', new webpack.DllPlugin({
    path: 'manifest/manifest.json',
    name: '[name]',
    context: './',
}));



cooking.add('vue.preserveWhitespace', false);



module.exports = cooking.resolve();