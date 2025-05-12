from flask import Flask
from werkzeug.security import generate_password_hash
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

from db import db
from models import User, Story

db.init_app(app)

def create_user(username, password):
    with app.app_context():
        if User.query.filter_by(username=username).first():
            print(f"User {username} already exists")
            return
        
        user = User(
            username=username,
            password_hash=generate_password_hash(password)
        )
        db.session.add(user)
        db.session.commit()
        print(f"User {username} created successfully")

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 3:
        print("Usage: python create_user.py <username> <password>")
        sys.exit(1)
    
    username = sys.argv[1]
    password = sys.argv[2]
    create_user(username, password) 