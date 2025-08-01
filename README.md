# Advanced Shoe Store

A full-stack e-commerce application for selling shoes, featuring a React frontend and Ruby on Rails backend.

## Features

- User authentication (login/register)
- Product catalog with categories
- Shopping cart functionality
- Admin dashboard for product management
- Responsive design for all devices

## Prerequisites

- Node.js (v14 or later)
- Ruby (3.x)
- Ruby on Rails (7.x)
- PostgreSQL
- Yarn or npm

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend-api
   ```

2. Install dependencies:
   ```bash
   bundle install
   ```

3. Set up the database:
   ```bash
   rails db:create
   rails db:migrate
   rails db:seed  # Optional: Load sample data
   ```

4. Start the Rails server:
   ```bash
   rails server -p 3000
   ```
   The API will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```

3. Start the development server:
   ```bash
   yarn dev
   # or
   npm run dev
   ```
   The application will be available at `http://localhost:3001`

## Environment Variables

### Backend

Create a `.env` file in the `backend-api` directory with the following variables:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/shoe_store_development
SECRET_KEY_BASE=your-secret-key-here
```

### Frontend

Create a `.env` file in the `frontend` directory with the following variables:

```
VITE_API_URL=http://localhost:3000
```

## Testing

### Backend Tests

Run the test suite with:

```bash
cd backend-api
bundle exec rspec
```

### Frontend Tests

Run the test suite with:

```bash
cd frontend
yarn test
# or
npm test
```

## Deployment

### Backend

The application can be deployed to any platform that supports Ruby on Rails applications, such as:
- Heroku
- Render
- AWS Elastic Beanstalk

### Frontend

The frontend can be deployed to:
- Vercel
- Netlify
- AWS S3 + CloudFront

## API Documentation

The API documentation is available at `http://localhost:3000/api-docs` when running the development server.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository.
