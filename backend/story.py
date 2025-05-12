from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from db import db
from models import Story, User
import openai
import os
import traceback
from datetime import datetime

story_bp = Blueprint('story', __name__)

@story_bp.route('/generate', methods=['POST'])
@jwt_required()
def generate_story():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        decline_reason = data.get('decline_reason', '')
        
        previous_stories = Story.query.filter_by(user_id=user_id).order_by(Story.created_at.desc()).limit(5).all()
        
        prompt = "You are a creative social media content generator. Generate short, engaging, authentic, and relatable Facebook status updates. These should be relevant as if you were a fun-loving woman in her 30s, living in the United States. You love to travel. Only provide a single story. The date is currently " + datetime.now().strftime("%B %d, %Y") + ". "
        
        if previous_stories:
            prompt += "\n\nConsider these previous stories and their ratings:\n"
            for story in previous_stories:
                rating_text = "liked" if story.rating == 1 else "disliked" if story.rating == -1 else "neutral"
                prompt += f"- Story: {story.content}\n  Rating: {rating_text}\n"
        
        if decline_reason:
            prompt += f"\nThe last story was declined because: {decline_reason}. Please avoid these issues in the new story."
        
        openai.api_key = os.getenv('OPENAI_API_KEY')
        if not openai.api_key:
            return jsonify({"msg": "OpenAI API key not configured"}), 500
        
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a creative social media content generator. Generate short, engaging, authentic, and relatable Facebook status updates. These should be relevant as if you were a fun-loving woman in her 30s, living in the United States. You love to travel. Only provide a single story. The date is currently " + datetime.now().strftime("%B %d, %Y") + ". "},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        story_text = response.choices[0].message.content.strip()
        
        if not story_text:
            return jsonify({"msg": "Failed to generate story"}), 500
        
        new_story = Story(
            user_id=user_id,
            content=story_text,
            created_at=datetime.utcnow()
        )
        db.session.add(new_story)
        db.session.commit()
        
        return jsonify({
            "story": story_text,
            "story_id": new_story.id
        })
        
    except Exception as e:
        print(f"Error in generate_story: {str(e)}")
        return jsonify({"msg": f"Error generating story: {str(e)}"}), 500

@story_bp.route('/rate', methods=['POST'])
@jwt_required()
def rate_story():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or 'story_id' not in data or 'rating' not in data:
            return jsonify({"msg": "Missing story_id or rating"}), 400
            
        story_id = data['story_id']
        rating = data['rating']
        decline_reason = data.get('decline_reason')
        
        if rating not in [1, -1]:
            return jsonify({"msg": "Invalid rating value"}), 400
            
        story = Story.query.filter_by(id=story_id, user_id=user_id).first()
        if not story:
            return jsonify({"msg": "Story not found"}), 404
            
        story.rating = rating
        if rating == -1 and decline_reason:
            story.decline_reason = decline_reason
        db.session.commit()
        
        return jsonify({"msg": "Rating saved successfully"})
        
    except Exception as e:
        print(f"Error in rate_story: {str(e)}")
        return jsonify({"msg": f"Error saving rating: {str(e)}"}), 500

@story_bp.route('/history', methods=['GET'])
@jwt_required()
def story_history():
    try:
        user_id = get_jwt_identity()
        stories = Story.query.filter_by(user_id=user_id).order_by(Story.created_at.desc()).all()
        
        return jsonify({
            "stories": [{
                "id": story.id,
                "content": story.content,
                "created_at": story.created_at.isoformat(),
                "rating": story.rating,
                "decline_reason": story.decline_reason
            } for story in stories]
        })
        
    except Exception as e:
        print(f"Error in story_history: {str(e)}")
        return jsonify({"msg": f"Error fetching story history: {str(e)}"}), 500 