require("package-script").spawn(
[
	{
		command: "npm",
		args: ["install", "-g", "grunt-cli"]
	},
	{
		command: "npm",
		args: ["install", "-g", "less"]
	},
	{
		command: "npm",
		args: ["install", "-g", "supervisor"]
	}
], {log: false});
