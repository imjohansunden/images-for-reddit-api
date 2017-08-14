### what's this

Images for reddit api fetches content from the reddit api. I first wrote it in php to use for the `Images for reddit` (rip) iOS app on the App Store. This is a js port written with express.

It will as stated fetch images from reddit for the given subreddit. Out of the box it will only fetch `jpg, gif and png`. But the script is very easily modified so go nuts. 

This is a very simple and not by any means an advanced script. It will not do all kind of cool stuff the reddit api can do and straight forward it is quite boring. But if you only want to fetch images from a subreddit it is very nice to use instead of getting a json answer from the reddit api including all kind of data.

### Example 

```js
fetch("http://localhost:5002/api/subreddit?input=pics").then(data => data.json()).then(response => {
	if (!response.err) {
		if (response.results) {
			// got results
		}
	} else {
		// error
	}
})
```
| flags | default flag value | description |
| --- | --- | --- | 
| `limit` | 30 | 1-100 |  
| `nsfw` | false | Can be true or false | 
