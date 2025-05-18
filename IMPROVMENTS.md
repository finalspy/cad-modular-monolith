Here are some improvements you can make to your app.js file for better structure, maintainability, and error handling:

---

### 1. **Add Error Handling Middleware**

Currently, there is no centralized error-handling middleware. Adding one ensures that unexpected errors are caught and handled gracefully.

```javascript
// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res
    .status(500)
    .render("error", { message: "An internal server error occurred." });
});
```

You can create an `error.ejs` file in the views directory to display a user-friendly error message.

---

### 2. **Use `asyncHandler` for Cleaner Async Code**

Instead of wrapping every `async` route in a `try-catch` block, you can use a utility like `express-async-handler` to simplify error handling.

Install it:

```bash
npm install express-async-handler
```

Update your route:

```javascript
const asyncHandler = require("express-async-handler");

app.get(
  "/",
  asyncHandler(async (req, res) => {
    const userId = req.session.user ? req.session.user.id : null;
    const presentations = userId
      ? await presentationService.listPresentations(userId)
      : [];
    const publicPresentations = await Presentation.find({ isPublic: true });

    res.render("index", {
      presentations,
      publicPresentations,
      message: null,
    });
  })
);
```

This eliminates the need for manual `try-catch` blocks.

---

### 3. **Validate Environment Variables**

Ensure that critical environment variables like `SESSION_SECRET` and `DATABASE_URL` are defined. You can add a check at the start of the file:

```javascript
if (!process.env.SESSION_SECRET || !process.env.DATABASE_URL) {
  console.error(
    "Missing required environment variables: SESSION_SECRET or DATABASE_URL"
  );
  process.exit(1);
}
```

---

### 4. **Set Security Headers**

Use the `helmet` middleware to set secure HTTP headers and improve security.

Install it:

```bash
npm install helmet
```

Add it to your middleware:

```javascript
const helmet = require("helmet");
app.use(helmet());
```

---

### 5. **Enable CORS if Needed**

If your app needs to handle requests from other origins (e.g., for APIs), use the `cors` middleware.

Install it:

```bash
npm install cors
```

Add it to your middleware:

```javascript
const cors = require("cors");
app.use(cors());
```

---

### 6. **Graceful Shutdown**

Handle server shutdown gracefully to close database connections and other resources.

```javascript
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await mongoose.disconnect();
  process.exit(0);
});
```

---

### 7. **Organize Routes**

Instead of defining routes directly in app.js, you can create a `routes/index.js` file to centralize route imports.

Example `routes/index.js`:

```javascript
const express = require("express");
const authRoutes = require("./authRoutes");
const presentationRoutes = require("./presentationRoutes");
const userRoutes = require("./userRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/presentations", presentationRoutes);
router.use("/users", userRoutes);

module.exports = router;
```

Update app.js:

```javascript
const routes = require("./routes");
app.use(routes);
```

---

### 8. **Use Compression**

Enable gzip compression to improve performance for serving static files and responses.

Install it:

```bash
npm install compression
```

Add it to your middleware:

```javascript
const compression = require("compression");
app.use(compression());
```

---

### 9. **Improve Static File Serving**

Add caching headers for static files to improve performance.

```javascript
app.use(express.static("public", { maxAge: "1d" }));
```

---

### 10. **Use a Logger**

Use a logging library like `morgan` to log HTTP requests for debugging and monitoring.

Install it:

```bash
npm install morgan
```

Add it to your middleware:

```javascript
const morgan = require("morgan");
app.use(morgan("dev"));
```

---

### Final Updated app.js

Here’s how your app.js could look after applying these improvements:

```javascript
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const asyncHandler = require("express-async-handler");
const routes = require("./routes");
require("dotenv").config();

if (!process.env.SESSION_SECRET || !process.env.DATABASE_URL) {
  console.error(
    "Missing required environment variables: SESSION_SECRET or DATABASE_URL"
  );
  process.exit(1);
}

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use((req, res, next) => {
  res.locals.session = req.session; // Make session available in all templates
  next();
});

// Set view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Connect to MongoDB
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use(routes);

// Serve static files
app.use(express.static("public", { maxAge: "1d" }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res
    .status(500)
    .render("error", { message: "An internal server error occurred." });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await mongoose.disconnect();
  process.exit(0);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

These changes improve security, performance, and maintainability while making your app more robust.

Similar code found with 1 license type
