from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os

from db import db  # Use the shared db instance

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'secretkey')

db.init_app(app)
jwt = JWTManager(app)

from auth import auth_bp
from story import story_bp
from facebook_utils import facebook_bp

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(story_bp, url_prefix='/story')
app.register_blueprint(facebook_bp, url_prefix='/facebook')

@app.route('/')
def health_check():
    return 'OK', 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True) 