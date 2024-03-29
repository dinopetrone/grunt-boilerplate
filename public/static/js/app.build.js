/**
 * Build profile for django-require.
 * 
 * This supports all the normal configuration available to a r.js build profile. The only gotchas are:
 *
 *   - 'baseUrl' will be overidden by django-require during the build process.
 *   - 'appDir' will be overidden by django-require during the build process.
 *   - 'dir' will be overidden by django-require during the build process. 
 */
({
    mainConfigFile: "./config.js",
    baseUrl: './',
    /*
     * find dependencies that are in deep-requires
     * e.x. require(['./module1'], function(){ require(['./module2']) });
     */
    findNestedDependencies: true,
    /*
     * Allow CSS optimizations. Allowed values:
     * - "standard": @import inlining, comment removal and line returns.
     * Removing line returns may have problems in IE, depending on the type
     * of CSS.
     * - "standard.keepLines": Like "standard" but keeps line returns.
     * - "none": Skip CSS optimizations.
     * - "standard.keepComments": Keeps the file comments, but removes line returns.
     * - "standard.keepComments.keepLines": Keeps the file comments and line returns.
     */
    optimizeCss: "standard",

    /*
     * How to optimize all the JS files in the build output directory.
     * Right now only the following values are supported:
     * - "uglify": Uses UglifyJS to minify the code.
     * - "uglify2": Uses UglifyJS2.
     * - "closure": Uses Google's Closure Compiler in simple optimization
     * mode to minify the code. Only available if REQUIRE_ENVIRONMENT is "rhino" (the default).
     * - "none": No minification will be done.
     */
    optimize: "uglify",
    
    /*
     * By default, comments that have a license in them are preserved in the
     * output. However, for a larger built files there could be a lot of
     * comment files that may be better served by having a smaller comment
     * at the top of the file that points to the list of all the licenses.
     * This option will turn off the auto-preservation, but you will need
     * work out how best to surface the license information.
     */
    preserveLicenseComments: true
    
})