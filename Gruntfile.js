module.exports = function(grunt) 
{

	grunt.initConfig(
	{
		pkg: grunt.file.readJSON("package.json"),
		
		less: 
		{
			compile: 
			{
            			options: 
				{
			                compress:true
				
				},
				files: 
				{
					"public/css/drop.css" : "less/drop.less",
					"public/css/resource.css" :  "less/resource.less"
				}
			}
		},
		cssmin : 
		{

			minify: 
			{
				expand: true,
				cwd: "public/css/",
				src: ["*.css", "!*.min.css"],
				dest: "public/css/",
				ext: ".min.css"
			}
		},
		uglify: 
		{
			js: 
			{
				files: 
				{
					"public/js/drop.min.js" : [ "public/js/drop.js" ]
				}
			}
		},
		watch: 
		{
	            files: ["less/*"],
	            tasks: ["less"]
		}
  	});


	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-cssmin");

	// Default task
	grunt.registerTask("default", ["less"]);
	grunt.registerTask("production", ["less", "cssmin", "uglify"]);

};
