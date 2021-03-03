module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-screeps');
  grunt.loadNpmTasks('grunt-babel');

  grunt.initConfig({
    babel: {
      options: {
        sourceMap: true,
        presets: ["@babel/preset-env"],
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['*.js'],
            dest: 'dist/'
          }
        ],
      }
    },
    screeps: {
      options: {
        email: process.env.SCREEPS_EMAIL,
        token: process.env.SCREEPS_TOKEN,
        branch: process.env.SCREEPS_BRANCH,
        //server: 'season'
      },
      dist: {
        src: ['dist/*.js']
      }
    }
  });

  grunt.registerTask('default', ['babel', 'screeps']);
};
