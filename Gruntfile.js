'use strict';

module.exports = function(grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('web-component-tester');

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist',
    tmp: '.tmp'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      options: {
        nospawn: true
      },
      default: {
        files: [
          '<%= yeoman.app %>/*.html',
          '<%= yeoman.app %>/elements/{,*/}*.html',
          '<%= yeoman.app %>/*.jade',
          '<%= yeoman.app %>/elements/{,*/}*.jade',
          '{<%= yeoman.tmp %>,<%= yeoman.app %>}/elements/{,*/}*.{css,js}',
          '{<%= yeoman.tmp %>,<%= yeoman.app %>}/styles/{,*/}*.css',
          '{<%= yeoman.tmp %>,<%= yeoman.app %>}/scripts/{,*/}*.js',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint']
      },
      jade: {
        files: ['<%= yeoman.app %>/*.jade', '<%= yeoman.app %>/elements/{,*/}*.jade'],
        tasks: ['newer:jade:server']
      },
      styles: {
        files: [
          '<%= yeoman.app %>/styles/{,*/}*.css',
          '<%= yeoman.app %>/elements/{,*/}*.css'
        ],
        tasks: ['newer:copy:styles', 'newer:autoprefixer:server']
      },
      sass: {
        files: [
          '<%= yeoman.app %>/styles/{,*/}*.{scss,sass}',
          '<%= yeoman.app %>/elements/{,*/}*.{scss,sass}'
        ],
        tasks: ['newer:sass:server', 'newer:autoprefixer:server']
      }
    },
    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      options: {
        loadPath: 'bower_components'
      },
      dist: {
        options: {
          style: 'compressed'
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: ['styles/{,*/}*.{scss,sass}', 'elements/{,*/}*.{scss,sass}'],
          dest: '<%= yeoman.dist %>',
          ext: '.css'
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: ['styles/{,*/}*.{scss,sass}', 'elements/{,*/}*.{scss,sass}'],
          dest: '<%= yeoman.tmp %>',
          ext: '.css'
        }]
      }
    },
    jade: {
      dist: {
        options: {
          data: {
            debug: true,
            pretty: true
          }
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: ['./*.jade', 'elements/{,*/}*.jade'],
          dest: '<%= yeoman.dist %>',
          ext: '.html'
        }]
      },
      test: {
        options: {
          data: {
            debug: true,
            pretty: true
          }
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: ['./*.jade', 'elements/{,*/}*.jade', 'test/{,*/}*.jade'],
          dest: '<%= yeoman.tmp %>',
          ext: '.html'
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: ['./*.jade', 'elements/{,*/}*.jade'],
          dest: '<%= yeoman.tmp %>',
          ext: '.html'
        }]
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.tmp %>',
          src: '**/*.css',
          dest: '<%= yeoman.tmp %>'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['**/*.css', '!bower_components/**/*.css'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    browserSync: {
      options: {
        notify: false,
        port: 9000,
        open: true
      },
      app: {
        options: {
          watchTask: true,
          injectChanges: false, // can't inject Shadow DOM
          server: {
            baseDir: ['<%= yeoman.tmp %>', '<%= yeoman.app %>'],
            routes: {
              '/bower_components': 'bower_components'
            }
          }
        },
        src: [
          '<%= yeoman.tmp %>/**/*.{css,html,js}',
          '<%= yeoman.app %>/**/*.{css,html,js}'
        ]
      },
      dist: {
        options: {
          server: {
            baseDir: 'dist'
          }
        },
        src: [
          '<%= yeoman.dist %>/**/*.{css,html,js}',
          '!<%= yeoman.dist %>/bower_components/**/*'
        ]
      }
    },
    clean: {
      dist: ['<%= yeoman.tmp %>', '<%= yeoman.dist %>/*'],
      server: '<%= yeoman.tmp %>'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        '<%= yeoman.app %>/scripts/{,*/}*.js',
        '!<%= yeoman.app %>/scripts/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    },
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= yeoman.dist %>']
      }
    },
    replace: {
      dist: {
        options: {
          patterns: [{
            match: /\/elements\/elements\.html/g,
            replacement: '/elements/elements.vulcanized.html'
          }]
        },
        files: {
          '<%= yeoman.dist %>/index.html': ['<%= yeoman.dist %>/index.html']
        }
      }
    },
    vulcanize: {
      default: {
        options: {
          strip: true
        },
        files: {
          '<%= yeoman.dist %>/elements/elements.vulcanized.html': [
            '<%= yeoman.dist %>/elements/elements.html'
          ]
        }
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,svg}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    minifyHtml: {
      options: {
        quotes: true,
        empty: true,
        spare: true
      },
      app: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: '*.html',
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,txt}',
            '.htaccess',
            '*.html',
            'elements/**',
            '!elements/**/*.scss',
            'images/{,*/}*.{webp,gif}',
            '!./*.jade',
            '!elements/{,*/}*.jade'
          ]
        }, {
          expand: true,
          dot: true,
          dest: '<%= yeoman.dist %>',
          src: ['bower_components/**']
        }]
      },
      styles: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.tmp %>',
          src: ['{styles,elements}/{,*/}*.css']
        }]
      }
    },
    'wct-test': {
      local: {
        options: {remote: false}
      },
      remote: {
        options: {remote: true}
      }
    },
    // See this tutorial if you'd like to run PageSpeed
    // against localhost: http://www.jamescryer.com/2014/06/12/grunt-pagespeed-and-ngrok-locally-testing/
    pagespeed: {
      options: {
        // By default, we use the PageSpeed Insights
        // free (no API key) tier. You can use a Google
        // Developer API key if you have one. See
        // http://goo.gl/RkN0vE for info
        nokey: true
      },
      // Update `url` below to the public URL for your site
      mobile: {
        options: {
          url: "https://developers.google.com/web/fundamentals/",
          locale: "en_GB",
          strategy: "mobile",
          threshold: 80
        }
      }
    }
  });

  grunt.registerTask('server', function(target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('serve', function(target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'browserSync:dist']);
    }

    grunt.task.run([
      'clean:server',
      'sass:server',
      'jade:server',
      'copy:styles',
      'autoprefixer:server',
      'browserSync:app',
      'watch'
    ]);
  });

  grunt.registerTask('test:local', ['clean:server', 'jade:test', 'wct-test:local']);
  grunt.registerTask('test:remote', ['clean:server', 'jade:test', 'wct-test:remote']);

  grunt.registerTask('build', [
    'clean:dist',
    'sass',
    'jade:dist',
    'copy',
    'useminPrepare',
    'imagemin',
    'concat',
    'autoprefixer',
    'uglify',
    'vulcanize',
    'usemin',
    'replace',
    'minifyHtml'
  ]);

  grunt.registerTask('default', [
    'jshint',
    // 'test'
    'build'
  ]);
};
