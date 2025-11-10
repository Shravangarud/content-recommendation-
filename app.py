from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

class RecommendationEngine:
    def __init__(self):
        self.tfidf_vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
        self.content_vectors = None
        self.content_df = None
        self.interaction_df = None
        
    def prepare_content_data(self, content_list):
        """Prepare content data for recommendations"""
        if not content_list:
            return None
            
        df = pd.DataFrame(content_list)
        
        # Create combined text for TF-IDF
        df['combined_text'] = df['title'] + ' ' + df['description'] + ' ' + df['category']
        if 'tags' in df.columns:
            df['combined_text'] = df['combined_text'] + ' ' + df['tags'].apply(lambda x: ' '.join(x) if isinstance(x, list) else '')
        
        self.content_df = df
        
        # Create TF-IDF vectors
        self.content_vectors = self.tfidf_vectorizer.fit_transform(df['combined_text'])
        
        return df
    
    def prepare_interaction_data(self, interactions):
        """Prepare user interaction data"""
        if not interactions:
            return None
            
        df = pd.DataFrame(interactions)
        
        # Create weights for different interaction types
        interaction_weights = {
            'view': 1,
            'like': 3,
            'rating': 2
        }
        
        df['weight'] = df['type'].map(interaction_weights)
        df['weight'] = df.apply(lambda x: x['weight'] * x['rating'] if x['rating'] > 0 else x['weight'], axis=1)
        
        self.interaction_df = df
        return df
    
    def content_based_filtering(self, content_id, top_n=6):
        """Content-based recommendations using TF-IDF and cosine similarity"""
        if self.content_df is None or self.content_vectors is None:
            return []
        
        # Find content index
        content_idx = self.content_df[self.content_df['id'] == content_id].index
        
        if len(content_idx) == 0:
            return []
        
        content_idx = content_idx[0]
        
        # Calculate cosine similarity
        similarity_scores = cosine_similarity(
            self.content_vectors[content_idx:content_idx+1],
            self.content_vectors
        ).flatten()
        
        # Get top N similar items (excluding itself)
        similar_indices = similarity_scores.argsort()[::-1][1:top_n+1]
        
        return self.content_df.iloc[similar_indices]['id'].tolist()
    
    def collaborative_filtering(self, user_id, top_n=12):
        """User-based collaborative filtering"""
        if self.interaction_df is None or len(self.interaction_df) == 0:
            return self.popularity_based_recommendations(top_n)
        
        # Create user-item matrix
        user_item_matrix = self.interaction_df.pivot_table(
            index='userId',
            columns='contentId',
            values='weight',
            fill_value=0
        )
        
        if user_id not in user_item_matrix.index:
            return self.popularity_based_recommendations(top_n)
        
        # Calculate user similarity
        user_similarity = cosine_similarity(user_item_matrix)
        user_similarity_df = pd.DataFrame(
            user_similarity,
            index=user_item_matrix.index,
            columns=user_item_matrix.index
        )
        
        # Get similar users
        similar_users = user_similarity_df[user_id].sort_values(ascending=False)[1:6]
        
        # Get items interacted by similar users
        similar_user_items = self.interaction_df[
            self.interaction_df['userId'].isin(similar_users.index)
        ]
        
        # Exclude items already interacted by current user
        user_items = set(self.interaction_df[
            self.interaction_df['userId'] == user_id
        ]['contentId'].tolist())
        
        # Calculate weighted scores
        recommendations = similar_user_items[
            ~similar_user_items['contentId'].isin(user_items)
        ].groupby('contentId')['weight'].sum().sort_values(ascending=False)
        
        return recommendations.head(top_n).index.tolist()
    
    def hybrid_recommendations(self, user_id, interactions, content_list, user_preferences, top_n=12):
        """Hybrid approach combining content-based and collaborative filtering"""
        self.prepare_content_data(content_list)
        self.prepare_interaction_data(interactions)
        
        # Get collaborative filtering recommendations
        collab_recs = self.collaborative_filtering(user_id, top_n * 2)
        
        # Get content-based recommendations based on user's liked items
        user_liked = [i['contentId'] for i in interactions if i['type'] == 'like']
        content_recs = []
        
        for content_id in user_liked[:3]:  # Use top 3 liked items
            similar = self.content_based_filtering(content_id, 5)
            content_recs.extend(similar)
        
        # Remove duplicates
        content_recs = list(dict.fromkeys(content_recs))
        
        # Combine recommendations
        hybrid_recs = collab_recs[:top_n//2] + content_recs[:top_n//2]
        
        # Remove duplicates and limit
        hybrid_recs = list(dict.fromkeys(hybrid_recs))[:top_n]
        
        # If not enough recommendations, add popular items
        if len(hybrid_recs) < top_n:
            popular = self.popularity_based_recommendations(top_n)
            hybrid_recs.extend([p for p in popular if p not in hybrid_recs])
            hybrid_recs = hybrid_recs[:top_n]
        
        return hybrid_recs
    
    def popularity_based_recommendations(self, top_n=12):
        """Fallback to popularity-based recommendations"""
        if self.content_df is None:
            return []
        
        # Return random sample if no better criteria
        return self.content_df.sample(min(top_n, len(self.content_df)))['id'].tolist()

# Initialize recommendation engine
rec_engine = RecommendationEngine()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'OK', 'message': 'ML API is running'})

@app.route('/recommend', methods=['POST'])
def get_recommendations():
    """Get personalized recommendations for a user"""
    try:
        data = request.json
        
        user_id = data.get('userId')
        interactions = data.get('interactions', [])
        all_content = data.get('allContent', [])
        user_preferences = data.get('userPreferences', {})
        top_n = data.get('topN', 12)
        
        if not user_id or not all_content:
            return jsonify({'error': 'Missing required parameters'}), 400
        
        # Generate recommendations
        recommendations = rec_engine.hybrid_recommendations(
            user_id,
            interactions,
            all_content,
            user_preferences,
            top_n
        )
        
        return jsonify({'recommendations': recommendations})
        
    except Exception as e:
        print(f"Error in recommendations: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/similar', methods=['POST'])
def get_similar_content():
    """Get similar content based on content-based filtering"""
    try:
        data = request.json
        
        content_id = data.get('contentId')
        all_content = data.get('allContent', [])
        top_n = data.get('topN', 6)
        
        if not content_id or not all_content:
            return jsonify({'error': 'Missing required parameters'}), 400
        
        # Prepare data
        rec_engine.prepare_content_data(all_content)
        
        # Get similar content
        similar = rec_engine.content_based_filtering(content_id, top_n)
        
        return jsonify({'similar': similar})
        
    except Exception as e:
        print(f"Error in similar content: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
