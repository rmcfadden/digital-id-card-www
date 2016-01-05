
var singularize = function(name)
{
	if(!name)
		return null;

	if(name == "")
		return "";

	if (endsWith(name,"ies"))
		return name.substring(0, name.length - 3) + "y";
	else if (name.length > 4 && endsWith(name,"sses"))
		return name.substring(0, name.length - 2);
	else if (endsWith(name,"s"))
		return name.substring(0, name.length - 1);

	return Name;	
}


var pluralize = function(name)
{
	if(!name)
		return null;

	if(name == "")
		return "";


	if (endsWith(name,"es"))
		return input;

	if (endsWith(name,"ss"))
		return name + "es";
	else if (endsWith(name,"er"))
		return name + "s";
	else if (endsWith(name,"y"))
		return name.substring(0, name.length - 1 ) + "ies";
	else if (endsWith(name,"x"))
		return name + "es";
	else if (endsWith(name,"s"))
		return name + "es";
	else
		return name += "s";


	return name;
} 


var endsWith = function (str, suffix) 
{
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}


module.exports.pluralize = pluralize;
module.exports.singularize = singularize;

