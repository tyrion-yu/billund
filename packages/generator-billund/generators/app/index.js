'use strict';

const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const yeoman = require('yeoman-generator');
const selfupdate = require('selfupdate');
const notifier = require('node-notifier');
const chalk = require('chalk');
const yosay = require('yosay');
const extend = require('deep-extend');
const Config = require('./config');
const camelCase = require('camelcase');
const pkgJSON = require('../../package.json');

const GENERATOR_NAME = pkgJSON.name;

const TEMPLATE_APPLICATION = 'application';
const TEMPLATE_WIDGET_REACT = 'widget-module-react';
const TEMPLATE_WIDGET_VUE = 'widget-module-vue';

/**
 * 读取git文件中的origin
 *
 * @return {String}
 */
function getGitOrigin() {
    let gitOrigin = '';
    try {
        let gitConfig = fs.readFileSync('./.git/config', 'utf-8');
        let m = gitConfig.match(/\[remote\s+"origin"]\s+url\s+=\s+(\S+)\s+/i);
        if (m) {
            gitOrigin = m[1];
        }
    } finally {
        return gitOrigin;
    }
}

/**
 * 提取repo中的homeUrl
 *
 * @param  {String} repo - repo地址
 * @return {String}
 */
function getHomeUrl(repo) {
    let url = '';
    try {
        let m = repo.match(/^git@(\S+)\.git$/i);
        if (m) {
            url = m[1].split(':').join('/');
        }
    } finally {
        return url;
    }
}

/**
 * 完整的执行流程
 *
 * 1:在初始化的时候，先尝试自动更新
 * 2:询问用户希望创建的项目，是application 还是 widget-module.
 * 4:项目名称
 * 5:版本号
 * 6:git地址
 * 7:keywords
 * 8:作者
 * 9:邮箱
 * 10:lisence
 * 11:根据用户选择的模板生成内容
 * 12:执行install
 */
const Flow = yeoman.Base.extend({
    initializing() {
        this.props = {};

        selfupdate.isUpdated(pkgJSON, (error, isUpdated) => {
            if (error) return;
            if (isUpdated) return;

            notifier.notify({
                title: GENERATOR_NAME,
                subtitle: '已有新版本,正在更新...',
                message: `如果更新失败，请手动更新\n执行 npm i -g ${GENERATOR_NAME}`,
                contentImage: path.resolve(__dirname, 'billund.jpg'),
                sound: true,
                wait: true
            }, (err, response) => {});

            selfupdate.update(pkgJSON, (e, version) => {
                if (e) return;

                notifier.notify({
                    title: GENERATOR_NAME,
                    subtitle: `更新完毕,当前版本: ${version}`,
                    message: '请重新运行本应用\n执行 yo billund',
                    contentImage: path.resolve(__dirname, 'billund.jpg'),
                    sound: true,
                    wait: true
                }, (err, response) => {});
            });
        });
    },
    prompting() {
        const done = this.async();

        this.log(yosay(`Welcome to the sweet ${chalk.red(GENERATOR_NAME)} generator!`));

        const prompts = [{
            name: 'boilerplate',
            message: 'your project type',
            type: 'list',
            choices: [TEMPLATE_APPLICATION, TEMPLATE_WIDGET_REACT, TEMPLATE_WIDGET_VUE],
            default: TEMPLATE_APPLICATION
        }, {
            name: 'name',
            message: 'Your project name',
            default: path.basename(process.cwd())
        }, {
            name: 'version',
            default: '1.0.0',
            message: 'version'
        }, {
            name: 'description',
            default: 'f2e isomorphic general GB project',
            message: 'description'
        }, {
            name: 'repo',
            default: getGitOrigin(),
            message: 'git repository'
        }, {
            name: 'keywords',
            default: 'billund isomorphic',
            message: 'keywords',
            filter(words) {
                return words.split(/\s*,\s*/g);
            }
        }, {
            name: 'author',
            default: this.user.git.name(),
            message: 'author'
        }, {
            name: 'email',
            default: this.user.git.email(),
            message: 'E-Mail'
        }];

        this.prompt(prompts, (props) => {
            this.props = props;
            done();
        });
    },
    default: function() {
        this.composeWith('license', {
            options: {
                name: this.props.author,
                email: this.props.email,
                website: ''
            }
        }, {
            local: require.resolve('generator-license/app')
        });
    },
    writing: {
        init() {
            const map = {
                [TEMPLATE_APPLICATION]: TEMPLATE_APPLICATION,
                [TEMPLATE_WIDGET_REACT]: TEMPLATE_WIDGET_REACT,
                [TEMPLATE_WIDGET_VUE]: TEMPLATE_WIDGET_VUE
            };
            this.currentDir = map[this.props.boilerplate] || TEMPLATE_APPLICATION;
        },
        'package_json': function() {
            const currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});
            currentPkg.version = this.props.version;
            const allPkgJson = extend({}, {
                [TEMPLATE_APPLICATION]: Config.APPLICATION_CONFIG,
                [TEMPLATE_WIDGET_REACT]: Config.WIDGET_REACT_CONFIG,
                [TEMPLATE_WIDGET_VUE]: Config.WIDGET_VUE_CONFIG
            });
            const selectedpkgJson = allPkgJson[this.props.boilerplate] || {};

            this.pkg = extend({
                name: _.kebabCase(this.props.name),
                description: this.props.description,
                repository: {
                    type: 'git',
                    url: this.props.repo
                },
                author: {
                    name: this.props.author,
                    email: this.props.email
                },
                keywords: [],
                dependencies: selectedpkgJson.dependencies || {},
                devDependencies: selectedpkgJson.devDependencies || {},
                scripts: selectedpkgJson.scripts || {},
                legoconfig: selectedpkgJson.legoconfig || {},
                config: {
                    'unsafe-perm': true
                },
                bugs: {
                    url: 'http://' + getHomeUrl(this.props.repo) + '/issues'
                },
                homepage: 'http://' + getHomeUrl(this.props.repo)
            }, currentPkg);

            if (this.props.keywords) {
                this.pkg.keywords = _.uniq(this.props.keywords.concat(this.pkg.keywords));
            }

            if (selectedpkgJson.main) {
                this.pkg.main = selectedpkgJson.main;
            }

            if (selectedpkgJson.browser) {
                this.pkg.browser = selectedpkgJson.browser;
            }

            this.fs.writeJSON(this.destinationPath('package.json'), this.pkg);
        },
        directories() {
            this.fs.copy(this.templatePath('./' + this.currentDir + '/static') + '/babelrc', this.destinationPath('./.babelrc'));
            this.fs.copy(this.templatePath('./' + this.currentDir + '/static') + '/eslintrc.json', this.destinationPath('./.eslintrc.json'));
            this.fs.copy(this.templatePath('./' + this.currentDir + '/static') + '/gitignore', this.destinationPath('./.gitignore'));
            this.fs.copy(this.templatePath('./' + this.currentDir + '/static') + '/npmignore', this.destinationPath('./.npmignore'));
            this.fs.copy(this.templatePath('./' + this.currentDir + '/static') + '/npmrc', this.destinationPath('./.npmrc'));
            this.fs.copy(this.templatePath('./' + this.currentDir + '/static') + '/**/*.*', this.destinationPath('./'));
            this.fs.copyTpl(this.templatePath('./' + this.currentDir + '/tpl') + '/**/*.*', this.destinationPath('./'), {
                PkgName: this.pkg.name,
                PkgDescription: this.pkg.description,
                AppName: this.pkg.name,
                AppNameCamel: camelCase(this.pkg.name)
            });
        },
        install() {
            const opt = {
                cwd: this.destinationPath('./')
            };
            this.spawnCommandSync('npm', ['install'], opt);
        }
    }
});

module.exports = Flow;
