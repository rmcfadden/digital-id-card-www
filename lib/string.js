String.prototype.capitalize = function() 
{
    
    if(this.length == 0)
	return "";

    if(this.length == 1)
	return this.charAt(0).toUpperCase();

    return this.charAt(0).toUpperCase() + this.slice(1);
}



if (typeof String.prototype.startsWith != "function") 
{
	String.prototype.startsWith = function (str)
	{
	    return this.indexOf(str) == 0;
	};
}

if (typeof String.prototype.endsWith !== "function") 
{
	String.prototype.endsWith = function(suffix) 
	{
	        return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};
}
