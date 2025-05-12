from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import db
from models import Story, User

facebook_bp = Blueprint('facebook', __name__)

@facebook_bp.route('/post', methods=['POST'])
@jwt_required()
def post_to_facebook():
    user_id = get_jwt_identity()
    data = request.get_json()
    story_id = data.get('story_id')
    story = Story.query.filter_by(id=story_id, user_id=user_id).first()
    if not story:
        return jsonify({'msg': 'Story not found'}), 404
    user = User.query.get(user_id)
    # Placeholder: Facebook API logic goes here
    # You will need to use user.facebook_access_token and Facebook Graph API
    # For now, just mark as posted
    story.posted = True
    story.facebook_post_id = 'placeholder_facebook_post_id'
    db.session.commit()
    return jsonify({'msg': 'Posted to Facebook (placeholder)', 'facebook_post_id': story.facebook_post_id}) 