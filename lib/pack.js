
var ora = require('ora');
var rm = require('rimraf');
var path = require('path');
var webpack = require('webpack');
var execSync = require('child_process').execSync;

var checkVersion = require('./check-versions');
var config = require('../config');
var Print = require('./print');

module.exports = function (webpackConfig) {
    // 检查版本
    checkVersion();

    // 查看 git 当前状态
    var status = execSync('git status');
    var statusString = String(status).replace('\n', '');
    // 没有未提交的修改，则上传代码，然后发布
    if (statusString.indexOf('working tree clean') !== -1) {
        // 取得分支的名称
        var branchNameWithBuffer = execSync('git rev-parse --abbrev-ref HEAD');
        var branchName = String(branchNameWithBuffer).replace('\n', '');

        // 提交分支
        Print.info('push current branch to origin, branch name: ' + branchName);
        execSync('git push origin ' + branchName);

        console.log('\n');
        var spinner = ora('Processing...');
        spinner.start();

        // rm(path.join(config.publish.assetsRoot, config.publish.assetsSubDirectory), err => {
        //     if (err) throw err;
            webpack(webpackConfig, (err1, stats) => {
                spinner.stop();
                if (err1) {
                    Print.error(err1);
                    process.exit();
                }

                Print.success('组件发布完成');
            });
        // });
    } else {
        Print.error('git working not clean, please commit your change');
    }
};
