# NPR Digital Services Stories API Exercise
by Ryan Haswell

The exercise was completed in NodeJS with Express. It connects to a MySQL server to retrieve data. There are a few configurable items which can be set in 'config.js'. The bulk of the interesting code is in 'controllers/stories.js' and 'models/story.js'.

## Running the Code

Make sure you have node and npm installed and on your command line. Use the following commands to grab dependencies and then start the server:

npm install
node app.js

The server will start at port 3000, which can be configured in 'config.js'. Navigate to http://localhost:3000 which will provide a link to view the list of stories being served.

## Design Decisions

Several notable decisions were made which I have detailed below.

### MySQL Server

The instructions were a bit unclear on what to do with the fictional database tables. I ended up creating a MySQL database at 'db4free.net' and populating it with the sample data. I created the database in the cloud in order to make it easier for my code to be evaluated - this way you don't have to set up a database on your machine. One downside is that connecting to 'db4free.net' is a bit slow, but for the purposes of the exercise I don't believe that it matters too much.

The database connection can be configured in 'config.js' in case you do wish to connect to a local database.

### Media API

The fictional media API that the instructions say is hosted at http://example.api.npr.org/stories/media seems to no longer exist. To get around that I decided to serve the same data from a route on my server (/api/media). This way I can simulate it being hosted externally and use async http requests to request it.

The endpoint is configured in 'config.js' so if you like you could have it point to an external endpoint.

### Database Queries - Single Query With Joins, or Multiple Queries?

I decided to use a single database query to access all needed story data utilizing a JOIN, rather than using multiple simpler queries. Running a single query with one or more joins is typically going to be faster than using multiple simpler queries, but this does depend on the specifics of the situation and is a point that should be tested with the real database. In this case, with this little data, it shouldn't really matter either way.

### Media API Concerns

The media API should ideally have some way to select by story ID or otherwise filter the requested data. Retrieving a potentially huge list across the network and then filtering it in memory is not ideal. This was out of my control for the exercise, however, and with such small data sets doesn't matter.

### Audio/Video Formats

The instructions only demonstrated returned media types of 'image' and 'audio', but not 'video'. However, the mp4 file container is typically used to store video, whereas mpeg-4 audio would typically be stored in an m4a file container. Based on the instructions of the exercise I decided to treat mp4 typed media as audio, however in the real world treating all received mp4 media as audio would be dangerous.