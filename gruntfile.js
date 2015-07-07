module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        wiredep: {
            task: {
                directory: './ressources/bower_components',
                bowerJson: require('./ressources/bower.json'),
                src: [
                    'views/*.jade'
                ],
                //cwd: '/ressources',
                includeSelf: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-wiredep');

    grunt.registerTask('default',['wiredep']);
};