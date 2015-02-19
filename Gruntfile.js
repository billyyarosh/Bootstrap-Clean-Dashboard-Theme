// JavaScript Document

module.exports = function(grunt) {
  
  grunt.initConfig({
  	less: {
      development: {
        files: {
          "css/customize-template.css": "less/customize-template.less" // destination file and source file
        }
      }
    },
    watch: {
      styles: {
        files: ['less/**/*.less'], // which files to watch
        tasks: ['less'],
        options: {
          nospawn: true
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', ['watch']);
  grunt.registerTask('default', ['less']);
};