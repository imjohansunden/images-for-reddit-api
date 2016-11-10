'use strict'

const express = require('express')
const request = require('request')
const md5 = require('md5')
const path = require('path')

const router = express.Router()

router.get('/subreddit', (req, res) => {
	const subreddit = req.query.input.match(/^\w+/)
	const limitFlagMatch = req.query.input.match(/--limit\s[0-9]{1,}/gi)
	const nsfwFlagMatch = req.query.input.match(/--nsfw\s(true\b|false\b)/gi)

	const nsfw = nsfwFlagMatch ? nsfwFlagMatch[0].replace('--nsfw ', '') === 'true' : false
	const limit = limitFlagMatch ? limitFlagMatch[0].replace('--limit ', '') : 30

	if (!subreddit) {
		res.contentType("application/json").status(204).send({
			err: "Did not enter any subreddit"
		})
	} else {
		const after = req.query.after ? '&after=' + req.query.after : ''
		const url = "http://reddit.com/r/" + subreddit + ".json?limit=" + limit + after

		const cacheKey = md5(url)

		request.get(url, (err, response) => {
			if (!err) {
				const body = JSON.parse(response.body)

				if (!body.data) {
					res.contentType("application/json").status(204).send({err: "no data property"})
					return
				}

				if (!body.data.children) {
					res.contentType("application/json").status(204).send({err: "no children property"})
					return
				}

				const before = body.data.before || null
				const after = body.data.after || null

				const validImageExtensions = ['.jpg', '.jpeg', '.gif', '.png']

				let results = []
				
				body.data.children.forEach(child => {
					let imageUrl = child.data.url
					let imageThumbnailUrl = child.data.thumbnail

					if (!nsfw && child.data.over_18) {
						return
					}

					if (imageUrl && !imageUrl.match("\/gallery\/|\/album\/|\/new\/|\/a\/|m.imgur.com\/") && imageThumbnailUrl && imageUrl.length > 1 && imageThumbnailUrl.length > 1) {
						imageUrl = imageUrl.replace(/ /g,'')
						imageThumbnailUrl = imageThumbnailUrl.replace(/ /g,'')

						imageUrl = imageUrl.replace('.gifv', '.gif')

						let imageThumbnailExtension = path.extname(imageThumbnailUrl)
						let imageExtension = path.extname(imageUrl)

						if (validImageExtensions.includes(imageThumbnailExtension)) {
							const filename = imageUrl.replace(imageExtension, '')

							if (!validImageExtensions.includes(imageExtension) && imageUrl.indexOf("imgur") > -1) {
								console.log("fixed extension")
								imageExtension = imageThumbnailExtension
							}

							const childUrl = filename + imageExtension

							if (validImageExtensions.includes(imageExtension)) {
								results = [...results, {
									id: md5(childUrl),
									sid: child.data.id,
									title: child.data.title,
									url: childUrl,
									thumbnail: imageThumbnailUrl,
									over_18: child.data.over_18,
									score: child.data.score,
									gilded: child.data.gilded
								}]
							}
						}
					}
				})

				res.contentType("application/json").status(200).send({
					before: results.length ? before : null,
					after: results.length ? after : null,
					results,
					cacheKey
				})
			}
		})
	}
	
})

module.exports = router
