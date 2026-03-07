# Arts Backend

Backend API for Arts project built with Node.js, TypeScript, Express.js, and MariaDB.

## Features

- ✅ TypeScript for type safety
- ✅ Express.js for API endpoints
- ✅ MariaDB database with connection pooling
- ✅ CORS enabled
- ✅ Environment configuration
- ✅ Error handling middleware
- ✅ ESLint & Prettier for code quality
- ✅ Hot reload with Nodemon

## Prerequisites

- Node.js (v17)
- npm or yarn
- MariaDB server running

## Installation

1. Clone the repository or navigate to the project directory

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file from the example:

```bash
cp .env.example .env
```

4. Update the `.env` file with your MariaDB credentials:

```
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=artsdb
DB_CONNECTION_LIMIT=10
```

5. Create the database in MariaDB:

```sql
CREATE DATABASE artsdb;
```

## Development

Run the development server with hot reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the PORT specified in .env)

## Production

Build the TypeScript code:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier

## API Endpoints

### Health Check

```
GET /api/health
```

Returns server status and timestamp.

## Project Structure

```
artsbackend/
├── src/
│   ├── config/
│   │   └── database.ts       # Database configuration
│   ├── controllers/
│   │   └── healthController.ts
│   ├── middleware/
│   │   └── errorHandler.ts   # Error handling middleware
│   ├── routes/
│   │   └── index.ts          # Route definitions
│   └── server.ts             # Express server setup
├── .env.example              # Environment variables template
├── .eslintrc.json            # ESLint configuration
├── .gitignore
├── .prettierrc.json          # Prettier configuration
├── nodemon.json              # Nodemon configuration
├── package.json
├── tsconfig.json             # TypeScript configuration
└── README.md
```

## Environment Variables

| Variable            | Description       | Default     |
| ------------------- | ----------------- | ----------- |
| PORT                | Server port       | 3000        |
| NODE_ENV            | Environment mode  | development |
| DB_HOST             | MariaDB host      | localhost   |
| DB_PORT             | MariaDB port      | 3306        |
| DB_USER             | Database user     | root        |
| DB_PASSWORD         | Database password | -           |
| DB_NAME             | Database name     | artsdb      |
| DB_CONNECTION_LIMIT | Max connections   | 10          |

## License

ISC
