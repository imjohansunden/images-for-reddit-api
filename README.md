# images-for-reddit-api

### Subreddit request
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
| --- | --- | --- | --- |    
| `--limit` | 30 | Can be 1-100 | 
| `--nsfw` | false | Can be true or false | 
