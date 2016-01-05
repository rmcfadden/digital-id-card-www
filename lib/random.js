var crypto = require("crypto");

function getRandomText(length)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


function getRandomHexText(length)
{
	return crypto.randomBytes(Math.ceil(length/2))
	        .toString("hex")
	        .slice(0,length); 
}



module.exports.getRandomText = getRandomText;
module.exports.getRandomHexText = getRandomHexText;
