_ = require 'underscore'

# Export Plugin
module.exports = (BasePlugin) ->
	# Define Plugin
	class TagsPlugin extends BasePlugin
		# Plugin name
		name: 'tagstore'

		getTags: (obj) ->
			tags = [obj] if _.isString obj
			tags = @getTags obj() if _.isFunction obj
			tags = obj if _.isArray obj

			tags

		renderBefore: ({documents, templateData, logger},next) ->
			try
				templateData[ 'tags' ] = tagsObject =
					data: {}
					store: (tagname, obj) ->
						if tagname
							key = tagname.toLowerCase()

							#for safety
							key = ['--',key,'--'].join '' if key in ['__proto__', 'prototype']

							if obj
								#set
								if @data[ key ]
									@data[ key ].documents.push obj
								else
									@data[ key ] =
										name : tagname
										documents : [obj]

								@data

							else
								#get
								@data[ key ]
						else
							@data

				for document in documents
					tags = @getTags document[ 'tags' ]
					for tag in tags
						tagsObject.store tag, document

				next()
			catch err
				return next(err)

