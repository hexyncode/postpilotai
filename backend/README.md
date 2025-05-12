# Flask Backend for Persona Story Generator

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set environment variables:**
   - `DATABASE_URL` (e.g., `postgresql://postgres:postgres@localhost:5432/fbai`)
   - `JWT_SECRET_KEY` (your secret key)
   - `OPENAI_API_KEY` (your OpenAI API key)

   You can use a `.env` file for convenience.

3. **Initialize the database:**
   In a Python shell:
   ```python
   from app import db
   db.create_all()
   ```

4. **Run the app:**
   ```bash
   python app.py
   ```

## Facebook API
- To post to a Facebook page, you will need to create a Facebook App and get a Page Access Token with `pages_manage_posts` permission.
- Store the access token in the `facebook_access_token` field for each user.
- The `/facebook/post` endpoint is a placeholder; you will need to implement the actual Facebook Graph API call.

## Endpoints
- `/auth/register` (POST): Register a new user
- `/auth/login` (POST): Login and get JWT
- `/story/generate` (POST): Generate a new story (JWT required)
- `/story/history` (GET): Get story history (JWT required)
- `/facebook/post` (POST): Post a story to Facebook (JWT required) 