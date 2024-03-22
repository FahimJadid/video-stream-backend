# Video Streaming Backend

## Description

This project is a backend service for a video streaming application. It handles user authentication, video uploads, video streaming, and provides additional features for enhanced user interaction.


## Features

The project has the following features:

- User Authentication: Users can sign up, log in, and log out. Passwords are hashed using bcrypt for security.
- Video Upload: Users can upload videos. Videos are stored in Cloudinary for efficient retrieval and streaming.
- Video Streaming: Users can stream videos. The backend handles video streaming requests and serves the appropriate video files.
- User Dashboard: Users have a personalized dashboard where they can view and manage their uploaded videos, liked videos, and subscriptions.
- Like and Comment: Users can like and comment on videos, providing a platform for user interaction and feedback.
- Tweet: Users can share their thoughts and updates through tweets.
- Subscription: Users can subscribe to other users' channels to get updates on their latest videos.
- Playlist: Users can create and manage playlists of their favorite videos.

## Dependencies

This project uses the following dependencies:

- bcrypt: 5.1.1
- cloudinary: 2.0.1
- cookie-parser: 1.4.6
- cors: 2.8.5
- dotenv: 16.4.2
- express: 4.18.2
- jsonwebtoken: 9.0.2
- mongoose: 8.1.1
- mongoose-aggregate-paginate-v2: 1.0.7
- multer: 1.4.5-lts.1

## Installation

To run this project, follow these steps:

1. Clone the repository: `git clone https://github.com/FahimJadid/video-stream-backend.git`
2. Install the dependencies: `npm install`
3. Start the project: `npm start`
4. Add .env file

## .env example
```
PORT=8000
MONGO_URI=

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

```

## Usage

After starting the project, it will listen for requests on `http://localhost:8000`. You can use a tool like Postman to send requests to the API endpoints.

## Contributing

If you want to contribute, please fork the repository and create a pull request. We appreciate any help!

## License

This project is licensed under the MIT License.
