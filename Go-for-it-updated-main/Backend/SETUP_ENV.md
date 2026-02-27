# Environment Setup Instructions

## Create .env File

1. In the `Backend` folder, create a new file named `.env` (not `.env.txt` or any other extension)

2. Copy the following content into the `.env` file:

```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
JWT_SECRET=change_this_secret
GEMINI_API_KEY=AIzaSyC0RBBi2Cq12O4fi6d9ixfhIZrim-wPHhY
GEMINI_MODEL=gemini-1.5-flash
```

3. Replace the `<username>`, `<password>`, `<cluster-url>`, and `<database>` placeholders in `MONGO_URI` with your actual MongoDB connection string.

4. Replace `change_this_secret` with a secure random string for `JWT_SECRET`.

5. Save the file.

## Important Notes

- The `.env` file is already in `.gitignore` and will not be committed to version control
- Never share your API keys publicly
- The GEMINI_API_KEY is already configured above
- After creating the `.env` file, restart your backend server

## Restart Server

After creating the `.env` file, restart your backend server for the changes to take effect.

