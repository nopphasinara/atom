/**
 * Created by Tivie on 12-11-2014.
 */

module.exports = function (grunt) {
    // Project configuration.
    var config = {
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                sourceMap: true,
                banner: ';/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n(function(){\n',
                footer: '}).call(this);\n'
            },
            dist: {
                src: [
                    'src/tokens.js',
                    'src/regex.js',
                    'src/lightMarkdown.js',
                    'src/loader.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            },
            test: {
                src: '<%= concat.dist.src %>',
                dest: '.build/<%= pkg.name %>.js',
                options: {
                    sourceMap: false
                }
            }
        },

        clean: ['.build/'],

        uglify: {
            options: {
                sourceMap: true,
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },

        endline: {
            dist: {
                files: {
                    'dist/<%= pkg.name %>.js': 'dist/<%= pkg.name %>.js',
                    'dist/<%= pkg.name %>.min.js': 'dist/<%= pkg.name %>.min.js'
                }
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            files: [
                'src/**/*.js'
            ]
        },

        conventionalChangelog: {
            options: {
                changelogOpts: {
                    preset: 'angular'
                }
            },
            release: {
                src: 'CHANGELOG.md'
            }
        },

        conventionalGithubReleaser: {
            release: {
                options: {
                    auth: {
                        type: 'oauth',
                        token: process.env.GH_TOEKN
                    },
                    changelogOpts: {
                        preset: 'angular'
                    }
                }
            }
        },

        simplemocha: {
            default: {
                src: ['test/**/*.js']
            }
        }
    };

    grunt.initConfig(config);

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('test', ['clean', 'jshint', 'concat:test', 'simplemocha', 'clean']);
    grunt.registerTask('build', ['test', 'concat:dist', 'uglify', 'endline']);
    grunt.registerTask('prep-release', ['build', 'conventionalChangelog']);

    // Default task(s).
    grunt.registerTask('default', ['test']);
};
