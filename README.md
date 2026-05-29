# PropertyHub Backend

Express + MongoDB API for PropertyHub.

## Tech Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- multer (property image upload)

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create env file:
   ```bash
   cp .env.example .env
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```

Server runs on `http://localhost:5000` by default.

## Environment Variables
See [.env.example](./.env.example).

Required:
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLIENT_URL`

## Scripts
- `npm run dev` - start with nodemon
- `npm start` - start production server
- `npm run seed` - seed sample users/properties

## API Endpoints
### Health
- `GET /api/health`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Properties
- `GET /api/properties`
- `GET /api/properties/:id`
- `GET /api/properties/my/listings` (agent)
- `POST /api/properties` (agent)
- `PUT /api/properties/:id` (agent owner)
- `DELETE /api/properties/:id` (agent owner)
- `POST /api/properties/upload` (agent, multipart `images`, max 3)

### Enquiries
- `POST /api/enquiries`

## Notes
- Uploaded images are served from `/uploads`.
