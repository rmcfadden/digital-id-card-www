(function($)
{
	jQuery.fn.extend(
	{

		// Plugin Name
		resource: function(options) 
		{			
			var $this = $(this);

			var defaults = 
			{  
			}; 
 
			var options = $.extend(defaults, options);  
			this.data("drop", options);

			return $this;
		}
	});

})(jQuery); 
