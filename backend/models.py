from db import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    facebook_access_token = db.Column(db.String(200))
    stories = db.relationship('Story', backref='user', lazy=True)

class Story(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    posted = db.Column(db.Boolean, default=False)
    facebook_post_id = db.Column(db.String(128), nullable=True)
    rating = db.Column(db.Integer, default=0)
    decline_reason = db.Column(db.Text, nullable=True)