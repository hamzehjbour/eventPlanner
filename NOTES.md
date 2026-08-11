# Why Relationships stored this way?

- The relationships stored this way mainly to avoid hitting the document size limit in MongoDB (16 MB)

# Why I implemented the text search this way?

- I chose Regex to keep the search simple and find results with partial word or even using a letter
- I didn't want to use text index because I didn't want to deal with rankings for a small seeded dataset

# What I would improve?

- I would make the UI a bit nicer I didn't focus on it to much because it's not a requirement and I used the time to start with vue.js

- I would add field limiting to the api instead of fetch the whole document when only one field is needed
