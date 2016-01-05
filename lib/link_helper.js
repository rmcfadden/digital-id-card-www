var config = require("../config");

var createResourceLink = function(uuid)
{
	if(!uuid)
		return null;

	var resourceRoot = "localhost";
	if(config.resourceRoot)
		resourceRoot = resourceRoot;

	return resourceRoot + "/resources/" + removeSlashesFromUuid(uuid);
}


var removeSlashesFromUuid = function(uuid)
{
	if(!uuid)
		return null;

	return uuid.replace(/\-/g,"");
}
	


module.exports.createResourceLink = createResourceLink;
module.exports.removeSlashesFromUuid = removeSlashesFromUuid;
