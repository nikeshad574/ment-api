# Create MENT API

A modern Express.js + TypeScript API template generator with built-in utilities and best practices.

## Features

- ⚡ **Express 5** - Latest Express.js framework
- 🔷 **TypeScript** - Full TypeScript support with type definitions
- ✅ **Validation** - Request validation with express-validator
- 🗄️ **MongoDB** - Mongoose ODM integration
- 📧 **Email** - Nodemailer for sending emails
- 🛠️ **Development Tools** - Nodemon and ts-node for hot reloading
- 📝 **Logging** - Morgan HTTP request logger
- ⚠️ **Error Handling** - Custom error middleware and utilities
- 🔧 **API Utilities** - Built-in pagination, filtering, and searching

## Quick Start

### Create a new project

```bash
npm create ment-api my-api
cd my-api
npm run dev
```

### Create in current directory

```bash
npm create ment-api .
```

## What's Included

### Project Structure

```
my-api/
├── src/
│   ├── app.ts                      # Express app configuration
│   ├── server.ts                   # Server entry point
│   ├── conf/
│   │   └── conf.ts                 # Configuration management
│   ├── middlewares/
│   │   └── error.middlewares.ts    # Error handling middleware
│   ├── service/
│   │   └── email.service.ts        # Email service
│   ├── utils/
│   │   ├── ApiAggregateFeatures.ts # MongoDB aggregation utilities
│   │   ├── ApiError.ts             # Custom error class
│   │   ├── ApiFeatures.ts          # Query features (filter, sort, paginate)
│   │   ├── ApiResponse.ts          # Standardized response format
│   │   ├── AsyncHandler.ts         # Async error handling wrapper
│   │   └── commonUtils.ts          # Common utility functions
│   └── validators/
│       ├── mongodb.validator.ts    # MongoDB validation utilities
│       └── validate.ts             # Validation middleware
├── public/                         # Static files
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies
```

### Dependencies

**Production:**

- `express` - Web framework
- `dotenv` - Environment variable management
- `mongoose` - MongoDB ODM
- `express-validator` - Request validation
- `nodemailer` - Email sending

**Development:**

- `typescript` - TypeScript compiler
- `ts-node` - TypeScript execution
- `nodemon` - Auto-restart on file changes
- `morgan` - HTTP request logger
- Type definitions for all dependencies

## Available Scripts

```bash
npm run dev    # Start development server with auto-reload
```

## Usage Examples

### Using API Response Utility

```typescript
import { ApiResponse } from "./utils/ApiResponse";

res.status(200).json(new ApiResponse(200, data, "Success message"));
```

### Using Async Handler (omits try catch boock)

```typescript
import { asyncHandler } from "./utils/AsyncHandler";

export const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.json(new ApiResponse(200, users, "Users fetched"));
});
```

### Using API Features (Pagination, Filtering, Sorting)

```typescript
import { ApiFeatures } from "./utils/ApiFeatures";

const features = new ApiFeatures(User.find(), req.query)
  .filter()
  .sort()
  .limitFields()
  .paginate();

const users = await features.query;
```

### Using Api Aggregated Features (Pagination, Filtering, Sorting)

```typescript
import { ApiAggregatedFeatures } from "./utils/ApiAggregatedFeatures";

const features = new ApiAggregatedFeatures(
  User.aggregate([
    {
      $match: {
        $id: "user_id_value",
      },
    },
  ]),
  req.query,
)
  .filter()
  .sort()
  .limitFields()
  .paginate();

const users = await features.aggregation;
```

### Custom Error Handling

```typescript
import { ApiError } from "./utils/ApiError";

throw new ApiError(400, "Invalid request parameters");

// -- or --

return next(
  new ApiError(400, "Error Custom Message", { error: "null or data" }),
);
```

## Environment Variables

Create a `.env` file in your project root:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/myapp

# Email configuration (nodemailer + gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## Requirements

- Node.js 16 or higher
- npm or yarn

## Why MENT API?

- 🚀 **Production Ready** - Built with best practices
- 📦 **Always Latest** - Installs the newest versions of all packages
- 🎯 **Opinionated** - Pre-configured structure to get started quickly
- 🔧 **Flexible** - Easy to customize and extend
- 📚 **Well Organized** - Clear separation of concerns

## Author

**Nikesh Adhikari**

## License

ISC

## Contributing

Issues and pull requests are welcome!

## Repository

[https://github.com/nikeshad574/ment-api](https://github.com/nikeshad574/ment-api)

---

**Happy Coding! 🎉**
