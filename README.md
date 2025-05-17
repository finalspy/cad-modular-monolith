# Monolithic Presentation App

This is a monolithic application built with Node.js and Express that allows users to create, manage, and view presentations using Reveal.js. Users can register, log in, and create presentations that can be either public or private.

## Features

- User registration and authentication
- Create presentations using Reveal.js syntax
- List all presentations
- View individual presentations
- Public and private presentation options
- User-specific presentation management

## Project Structure

```
monolithic-app
├── src
│   ├── app.js                     # Entry point of the application
│   ├── controllers                # Controllers for handling requests
│   │   ├── authController.js      # User authentication logic
│   │   ├── presentationController.js # Presentation management logic
│   │   └── userController.js      # User management logic
│   ├── models                     # Database models
│   │   ├── presentation.js         # Presentation model
│   │   └── user.js                # User model
│   ├── routes                     # API routes
│   │   ├── authRoutes.js          # Authentication routes
│   │   ├── presentationRoutes.js   # Presentation routes
│   │   └── userRoutes.js          # User routes
│   ├── services                   # Business logic
│   │   ├── authService.js         # Authentication services
│   │   └── presentationService.js  # Presentation services
│   └── utils                      # Utility functions
│       └── helpers.js             # Helper functions
├── public                         # Static files
│   ├── css
│   │   └── styles.css             # CSS styles
│   ├── js
│   │   └── scripts.js             # Client-side JavaScript
│   └── index.html                 # Main HTML file
├── views                          # EJS templates
│   ├── createPresentation.ejs     # Template for creating presentations
│   ├── listPresentations.ejs      # Template for listing presentations
│   ├── login.ejs                  # Login page template
│   ├── register.ejs               # Registration page template
│   └── viewPresentation.ejs       # Template for viewing a presentation
├── package.json                   # NPM configuration
├── .env                           # Environment variables
├── .gitignore                     # Git ignore file
└── README.md                      # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd monolithic-app
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory and configure your environment variables.

## Usage

1. Start the application:
   ```
   npm start
   ```
2. Open your browser and navigate to `http://localhost:3000` to access the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.