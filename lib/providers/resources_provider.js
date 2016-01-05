var config = require("../../config");
var string = require("../string");


var repositoryFactory = require("../repository_factory");
var factory = new repositoryFactory();


var lookupProvider = require("./lookup_provider");
var lookupProv = new lookupProvider();


var resourcesProvider = function()
{
	this.createFile = function(file, callback)
	{
		this.createFullResource(file, "file", callback);	
	}



	this.createImage = function(image, callback)
	{
		this.createFullResource(image, "image", callback);	
	}


	this.createLink = function(link, callback)
	{
		if(link && link.location)
			link.size = link.location.length;

		this.createFullResource(link, "link", callback);
	}


	this.createFile = function(file, callback)
	{
		this.createFullResource(file, "file", callback);
	}


	this.createList = function(list, callback)
	{
		list.size = 0;
		this.createFullResource(list, "list", callback);
	}


	this.createFullResource = function(resource, resourceType, callback)
	{

		if(!resource)
		{
			callback("resource arg cannot be empty");
			return;
		}


		if(!resourceType)
		{
			callback("resourceType arg cannot be empty");
			return;
		}

		resource.resourceType = resourceType;

		var proxyThis = this;
		this.createResource(resource, function(error, resourceResult)
		{	
			if(error)
			{
				callback(error);
				return;			
			}
		
			resource.resource_id = resourceResult.insertId;
			
	
			var capitalizedResourceType = resourceType.capitalize();
		

			proxyThis["create" + capitalizedResourceType + "Resource"](resource, function(error, result)
			{
				if(error)
				{
					callback(error);
					return;			
				}
			
				if(result.insertId == null)
				{
					callback("error inserting image resource");
					return;				
				} 

				proxyThis["get" + capitalizedResourceType + "ResourceByResourceId"](resource.resource_id, function(error, result)
				{
					callback(error, result);
				});
			});
		});
	
	}


	this.createLinkResource = function(link, callback)
	{
		if(!link)
		{
			callback("link arg cannot be empty");
			return;
		}

		link.resourceType = "link";
		
		var proxyThis = this;
		this.createResource(link, function(error, resourceResult)
		{	
			if(error)
			{
				callback(error);
				return;			
			}

			link.resource_id = resourceResult.insertId;
				
			proxyThis.createLinkResource(link, function(error, result)
			{
				if(result.insertId == null)
				{
					callback("error inserting link resource");
					return;				
				} 

				proxyThis.getLinkResourceByResourceId(link.resource_id, function(error, result)
				{
					callback(error, result);
				});
				
			});
		});	
	}



	this.createImageResource = function(args, callback)
	{
		if(!args)
		{
			callback("args must be defined");
			return;
		}


		if(!args.resource_id)
		{
			callback("args.resource_id must be defined");
			return;
		}


		this.createFileResource(args, function(error, imageResult)
		{
			if(error)
			{
				callback(error);
				return;			
			}


			factory.create({modelName: "image_resource" }, function(error, repo)
			{
				var type = "large";
				if(args.type)
					type = args.type;

				var width = 0;
				if(args.width)
					width = args.width;

				var height = 0;
				if(args.height)
					height = args.height;

				var newImageResource = 
				{
					"file_resource_id" : imageResult.insertId,
					"type" : type,
					"width" : width,
					"height" : height
				};

				repo.create(newImageResource, function(error, result) 
				{ 
					result.resource_id = args.resource_id;

					callback(error, result);
				});
			});
		});
	}


	this.createFileResource = function(args, callback)
	{
		if(!args)
		{
			callback("args must be defined");
			return;
		}


		if(!args.resource_id)
		{
			callback("args.resource_id must be defined");
			return;
		}


		factory.create({modelName: "file_resource" }, function(error, repo)
		{
			var sha1 = "";
			if(args.sha1)
				sha1 = args.sha1;


			var is_remote_synced = false;
			if(args.is_remote_synced)
				is_remote_synced = args.is_remote_synced;

			var newFileResource = 
			{
				"resource_id" : args.resource_id,
				"sha1" : sha1,
				"is_remote_synced" : is_remote_synced
			};

			repo.create(newFileResource, function(error, result) 
			{ 

				callback(error, result);
			});
		});
	}
	

	this.createLinkResource = function(args, callback)
	{
		if(!args)
		{
			callback("args must be defined");
			return;
		}


		if(!args.resource_id)
		{
			callback("args.resource_id must be defined");
			return;
		}


		if(!args.location)
		{
			callback("args.location must be defined");
			return;
		}


		factory.create({ modelName: "link_resource" }, function(error, repo)
		{
			var newLinkResource = 
			{
				"resource_id" : args.resource_id,
				"location" : args.location

			};

			repo.create(newLinkResource, function(error, result) 
			{
				callback(error, result);
			});
		});
	}


	this.createListResource = function(args, callback)
	{
		if(!args)
		{
			callback("args must be defined");
			return;
		}


		if(!args.resource_id)
		{
			callback("args.resource_id must be defined");
			return;
		}


		factory.create({ modelName: "list_resource" }, function(error, repo)
		{
			var newListResource = 
			{
				"resource_id" : args.resource_id
			};

			repo.create(newListResource, function(error, result) 
			{
				callback(error, result);
			});
		});
	}




	this.getLinkResourceByResourceId =  function(id, callback)
	{
		this.getResourceByResourceId(id, "link", ["location"], callback);
	}


	this.getFileResourceByResourceId =  function(id, callback)
	{
		this.getResourceByResourceId(id, "file", ["sha1"], callback);
	}

	this.getListResourceByResourceId =  function(id, callback)
	{
		this.getResourceByResourceId(id, "list", [], callback);
	}


	this.getImageResourceByResourceId = function(id, callback)
	{
		this.getResourceByResourceId(id, "file", ["sha1"], function(error, result)
		{
			if(error)
			{
				callback(error);
				return;			
			}

			factory.create({modelName:  "image_resource"}, function(error, repo)
			{
				repo.findByFile_resource_id(result[0].file_resource_id, function(error, imageResult) 
				{ 

					if(imageResult.length == 0)				
					{
						callback(error, null);
						return;
					}


					result[0].type = imageResult[0].type;
					result[0].height = imageResult[0].height;
					result[0].width = imageResult[0].width;

					callback(error, result);
				});


			});
		});	
	}


	this.getResourceByResourceId =  function(id, resourceType, attributes, callback)
	{
		if(!id)
		{
			callback("id must be defined");
			return;
		}

		var proxyThis = this;
		this.getResourceById(id, function(error, resources)
		{
			if(error)
			{
				callback(error);
				return;			
			}

			
			if(resources.length == 0)				
			{
				callback(error, null);
				return;
			}


			factory.create({modelName:  resourceType + "_resource"}, function(error, repo)
			{
				if(error)
				{
					callback(error);
					return;					
				}

				repo.findByResource_id(resources[0].id, function(error, resourceItems) 
				{ 
					if(error)
					{
						callback(error);
						return;					
					}

					if(resourceItems.length == 0)				
					{
						callback(error, resourceItems);
						return;
					}

				
					resources[0][resourceType + "_resource_id"] = resourceItems[0].id;
	
					for(i=0; i < attributes.length; i++)
					{
						var attribute = attributes[i];
						resources[0][attribute] = resourceItems[0][attribute];
					}					

					callback(error, resources);
				
				});
			});							
		});
	}


	// Too much nesting here!!
	this.deleteResourceImageByResourceId = function(id, callback)
	{

		if(!id)
		{
			callback("id must be defined");
			return;
		}

		var proxyThis = this;
		factory.create({modelName: "file_resource" }, function(error, fileRepo)
		{
			if(error)
			{
				callback(error);
				return;				
			}

			fileRepo.findByResource_id(id, function(error, fileResults) 
			{ 
				if(error)
				{
					callback(error);
					return;				
				}


				if(fileResults.length == 0)
				{
					callback("cannot file any file results", null);
					return;				
				}

				factory.create({modelName: "image_resource" }, function(error, imageRepo)
				{
					imageRepo.findByFile_resource_id(fileResults[0].id, function(error, imageResults) 
					{	 

						if(error)
						{
							callback(error);
							return;				
						}

						if(imageResults.length == 0)
						{
							callback("cannot file any image results", null);
							return;				
						}


						imageRepo.remove({id : imageResults[0].id }, function(error, deleteResult) 
						{ 
							fileRepo.remove({id : fileResults[0].id }, function(error, deleteResult)
							{
								proxyThis.deleteResourceById(fileResults[0].resource_id, function(error, result)
								{
									callback(error, result);	
								});
							});
						});
					});

				});

				
			});
	
		});


	}


	this.deleteResourceLinkByResourceId = function(id, callback)
	{
		this.deleteResourceByResourceId(id, "link", callback);
	}


	this.deleteResourceFileByResourceId = function(id, callback)
	{
		this.deleteResourceByResourceId(id, "file", callback);
	}


	this.deleteResourceListByResourceId = function(id, callback)
	{
		this.deleteResourceByResourceId(id, "list", callback);
	}


	this.deleteResourceByResourceId = function(id, resourceType, callback)
	{
		if(!id)
		{
			callback("id must be defined");
			return;
		}

		var proxyThis = this;
		factory.create({modelName: resourceType + "_resource" }, function(error, repo)
		{
			if(error)
			{
				callback(error);
				return;				
			}

			repo.findByResource_id(id, function(error, results) 
			{ 
				if(error)
				{
					callback(error);
					return;				
				}


				if(results.length == 0)
				{
					callback(null, null);
					return;				
				}
				
				repo.remove({id : results[0].id }, function(error, deleteResult) 
				{ 
					proxyThis.deleteResourceById(results[0].resource_id, function(error, result)
					{
						callback(error, result);	
					});
				});
			});
	
		});
	};


	this.createResource = function(args, callback)
	{
		if(!args)
		{
			callback("args must be defined");
			return;
		}


		if(!args.user_id)
		{
			callback("args.user_id must be defined");
			return;
		}


		if(!args.resourceType)
		{
			callback("args.resourceType must be defined");
			return;
		}

		if(!args.hasOwnProperty("size"))
		{
			callback("args.size must be defined");
			return;
		}


		if(!args.resourceAccess)
			args.resourceAccess = "hidden";


		this.getResourceTypesAccessesLookup(function(error, result)
		{
			if(error)
			{
				callback(error);
				return;			
			}


			if(!result.resourceTypes.hasOwnProperty(args.resourceType))
			{
				callback("resource_type " + args.resourceType + " not found");
				return;			
			}


			if(!result.resourceAccesses.hasOwnProperty(args.resourceAccess))
			{
				callback("resource_access " + args.resourceAccesss + " not found");
				return;			
			}



			factory.create({modelName: "resource", shard : { user_id: args.user_id }  }, function(error, repo)
			{
				var name = "";
				if(args.name)
					name = args.name;

				var title = "";
				if(args.title)
					title = args.title;

				var size = 0;
				if(args.size)
					size = args.size;

				var newResource = 
				{
					"user_id" : args.user_id,
					"resource_type_id" : result.resourceTypes[args.resourceType],
					"resource_access_id" : result.resourceAccesses[args.resourceAccess],
					"name" : name,
					"title" : title,
					"size" : size
				};
	
				repo.create(newResource, function(error, result) 
				{ 
					if(error)
					{
						callback(error, null);
						return;			
					}

					repo.findById(result.insertId, function(error, results)
					{
						if(error)
						{
							callback(error, null);
							return;			
						}

						if(results.length == 0)
						{
							callback("error adding resources to the db", null);
							return;	
						}

	

						// lookup the resource, uuid if a hashtag is not provided
						lookupProv.add("resources", { resource_id: result.insertId, user_id: args.user_id, hashtag: results[0].uuid }, function(error, lookupResults)
						{
							if(error)
							{
								callback(error, null);
								return;			
							}

							if(lookupResults.length == 0)
							{
								callback("error adding user to the lookups db", null);
								return;	
							}


							callback(error, result);
						});
					});
				});
			});
		});	
	}


	this.getResourceById = function(id, callback)
	{
		if(!id)
		{
			callback("id must be defined");
			return;
		}


		factory.create({modelName: "resource" }, function(error, repo)
		{
			repo.findById(id, function(error, result) 
			{ 
				callback(error, result);
			});
		});
	}


	this.deleteResourceById = function(id, callback)
	{
		if(!id)
		{
			callback("id arg must be defined");
			return;
		}

		lookupProv.get("resources", { resource_id: id }, function(error, lookupResults)
		{

			if(error)
			{
				callback(error, null);
				return;			
			}

			if(lookupResults.length != 1)
			{
				callback("cannot find resource for resource_id " + id + " in the lookup table", null);
				return;
			}


			factory.create({modelName: "resource", shard : { user_id : lookupResults[0].user_id } }, function(error, repo)
			{
				repo.remove({ "id" : id }, function(error, result) 
				{ 
					lookupProv.remove("resources", { resource_id: id }, function(error, lookupResults)
					{
						callback(error, result);
					});
				});
			});
		});


	}


	this.getResourceTypesAccessesLookup = function(callback)
	{
		var proxyThis = this;
		this.getResourceTypesLookup(function(error, resourceTypes)
		{
			proxyThis.getResourceAccessesLookup(function(error, resourceAccesses)
			{
				callback(null, { resourceTypes: resourceTypes, resourceAccesses: resourceAccesses});
			});
		
		});
	}

	

	this.getResourceTypesLookup = function(callback)
	{
		factory.create({ modelName: "resource_type" }, function(error, repo)
		{
			repo.getNamesLookup(function(error, results) 
			{
				if(error)
				{
					callback(error);
					return;				
				}

				callback(null, results);
			});
		});
	}


	this.getResourceAccessesLookup = function(callback)
	{
		factory.create({ modelName: "resource_access" }, function(error, repo)
		{
			repo.getNamesLookup(function(error, results) 
			{
				if(error)
				{
					callback(error);
					return;				
				}

				callback(null, results);
			});
		});
	}


}

module.exports = resourcesProvider;
