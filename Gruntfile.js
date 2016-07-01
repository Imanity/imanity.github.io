// 包装函数
module.exports = function(grunt) {

  // 任务配置,所有插件的配置信息
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'daily/2016-7-1.html': 'dist/daily/2016-7-1.html',
          'public/hw1.html': 'dist/public/hw1.html',
          'index.html': 'dist/index.html'
        }
      }
    },

    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'stylesheet.css': ['dist/stylesheet.css', 'dist/stylesheet_mobile.css'],
          'stylesheet_mobile.css': ['dist/stylesheet.css', 'dist/stylesheet_mobile.css']
        }
      }
    }
  });

  // 告诉grunt我们将使用插件
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // 告诉grunt当我们在终端中输入grunt时需要做些什么
  grunt.registerTask('default', ['htmlmin', 'cssmin']);

};
