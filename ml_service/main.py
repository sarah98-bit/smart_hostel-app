# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MinMaxScaler, normalize
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import hstack
from sklearn.decomposition import TruncatedSVD
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Initialize FastAPI ---
app = FastAPI(title="DKUT Hostel Recommendation API")

# --- Add CORS middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Load dataset ---
try:
    df = pd.read_csv("dkut_hostels.csv")
    logger.info(f"Loaded {len(df)} hostels from dataset")
except FileNotFoundError:
    logger.error("dkut_hostels.csv not found!")
    raise

# Combine text features for content-based filtering
df['cbf_text'] = (
    df['name'].fillna('') + " " +
    df['facilities'].fillna('') + " " +
    df['room_types'].fillna('') + " " +
    df.get('description', pd.Series([''] * len(df)))
)

# --- Content-based setup ---
tfidf = TfidfVectorizer(stop_words='english', ngram_range=(1,2), max_features=1000)
tfidf_matrix = tfidf.fit_transform(df['cbf_text'])

# Scale numerical features
df['rating_scaled'] = df['rating'] * 2.0
df['price_scaled'] = df['price_kes_per_month'] * 1.5
df['distance_scaled'] = df['distance_km'] * 1.2

num_features = df[['distance_scaled', 'price_scaled', 'rating_scaled']]
num_scaled = MinMaxScaler().fit_transform(num_features)

# Combine text and numerical features
X = hstack([tfidf_matrix * 0.6, num_scaled * 0.4])
X = normalize(X)

logger.info("Content-based filtering setup complete")

# --- Collaborative filtering setup ---
users = [f"U{i}" for i in range(1, 501)]
ratings_data = []

for user in users:
    rated_hostels = np.random.choice(df['hostel_id'], size=np.random.randint(5,16), replace=False)
    for hid in rated_hostels:
        ratings_data.append({"user_id": user, "hostel_id": hid, "rating": np.random.randint(1,6)})

user_ratings = pd.DataFrame(ratings_data)
user_item = user_ratings.pivot(index='user_id', columns='hostel_id', values='rating').fillna(0)

svd = TruncatedSVD(n_components=min(50, min(user_item.shape)-1), random_state=42)
latent = svd.fit_transform(user_item)
preds_df = pd.DataFrame(np.dot(latent, svd.components_), index=user_item.index, columns=user_item.columns)

logger.info("Collaborative filtering setup complete")

# --- Pydantic Models ---
class ContentBasedRequest(BaseModel):
    hostel_index: int = Field(..., description="Index of the hostel to find similar hostels")
    top_n: int = Field(5, ge=1, le=20, description="Number of recommendations to return")

class CFRequest(BaseModel):
    user_id: str = Field(..., description="User ID for collaborative filtering")
    top_n: int = Field(5, ge=1, le=20, description="Number of recommendations to return")

class RecommendationRequest(BaseModel):
    maxPrice: float = Field(..., description="Maximum price in KES per month")
    maxDistance: float = Field(..., description="Maximum distance in km")
    roomType: str = Field(..., description="Preferred room type")
    facilities: List[str] = Field(default=[], description="List of required facilities")
    user_id: Optional[str] = Field(None, description="User ID for personalization")
    hostel_index: Optional[int] = Field(None, description="Reference hostel for similarity")
    top_n: int = Field(10, ge=1, le=20, description="Number of recommendations to return")

class HostelResponse(BaseModel):
    hostel_id: str
    name: str
    price_kes_per_month: float
    distance_km: float
    room_types: str
    facilities: str
    score: float

# --- CBF function ---
def recommend_content_based(hostel_index: int, top_n: int = 5) -> List[dict]:
    """Content-based filtering recommendation"""
    if hostel_index < 0 or hostel_index >= len(df):
        raise HTTPException(status_code=400, detail="Invalid hostel index")
    
    sims = cosine_similarity(X[hostel_index], X).flatten()
    # Add rating boost
    sims = sims + (df['rating'] / 5) * 0.10
    sims[hostel_index] = -1  # Exclude the reference hostel
    
    top = sims.argsort()[::-1][:top_n]
    return df.iloc[top][["hostel_id","name","price_kes_per_month","distance_km","facilities","rating","room_types"]].to_dict(orient="records")

# --- CF function ---
def recommend_cf_svd(user_id: str, top_n: int = 5) -> List[dict]:
    """Collaborative filtering recommendation using SVD"""
    if user_id not in preds_df.index:
        logger.warning(f"User {user_id} not found in CF data")
        raise HTTPException(status_code=404, detail=f"User {user_id} not found")
    
    preds = preds_df.loc[user_id].copy()
    rated_mask = user_item.loc[user_id] > 0
    preds[rated_mask] = -np.inf
    
    top_hostels = preds.nlargest(top_n).index.tolist()
    return df[df['hostel_id'].isin(top_hostels)][["hostel_id","name","price_kes_per_month","distance_km","facilities","rating","room_types"]].to_dict(orient="records")

# --- Root endpoint ---
@app.get("/")
def root():
    return {
        "message": "DKUT Hostel Recommendation API is running!",
        "version": "1.0.0",
        "endpoints": [
            "/recommendations",
            "/recommend/content-based",
            "/recommend/collaborative-filtering"
        ]
    }

# --- Health check endpoint ---
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "hostels_loaded": len(df),
        "ml_models_ready": True
    }

# --- Hybrid /recommendations endpoint ---
@app.post("/recommendations", response_model=List[HostelResponse])
def recommend_hostels(req: RecommendationRequest):
    """
    Hybrid recommendation system combining:
    1. Preference-based filtering (price, distance, room type, facilities)
    2. Content-based filtering (similarity to reference hostel)
    3. Collaborative filtering (user preferences)
    """
    logger.info(f"Received recommendation request: {req.dict()}")
    
    scored = []

    # Loop through all hostels
    for idx, hostel in df.iterrows():
        score = 0.0

        # === 1. Preference-based scoring ===
        
        # Price matching (weight: 3)
        if hostel['price_kes_per_month'] <= req.maxPrice:
            score += 3
        else:
            # Penalty for exceeding budget
            price_diff = hostel['price_kes_per_month'] - req.maxPrice
            score -= min(price_diff / req.maxPrice, 2)  # Max penalty of 2
        
        # Distance matching (weight: 3)
        if hostel['distance_km'] <= req.maxDistance:
            score += 3
        else:
            # Penalty for exceeding distance
            dist_diff = hostel['distance_km'] - req.maxDistance
            score -= min(dist_diff, 2)  # Max penalty of 2
        
        # Room type matching (weight: 2)
        if req.roomType.lower() in str(hostel['room_types']).lower():
            score += 2
        
        # Facilities matching (weight: 1 per facility)
        hostel_facilities = [f.strip().lower() for f in str(hostel['facilities']).split(",")]
        matched_facilities = [f for f in req.facilities if f.lower() in hostel_facilities]
        score += len(matched_facilities)
        
        # Rating bonus (weight: 1)
        score += (hostel['rating'] / 5) * 1

        # === 2. Content-based similarity boost ===
        if req.hostel_index is not None and 0 <= req.hostel_index < len(df):
            sim = cosine_similarity(X[req.hostel_index], X[idx]).flatten()[0]
            score += sim * 3  # Weight for similarity

        scored.append({
            "hostel_id": str(hostel['hostel_id']),
            "name": str(hostel['name']),
            "price_kes_per_month": float(hostel['price_kes_per_month']),
            "distance_km": float(hostel['distance_km']),
            "room_types": str(hostel['room_types']),
            "facilities": str(hostel['facilities']),
            "score": round(score, 2)
        })

    # === 3. Collaborative filtering boost ===
    if req.user_id and req.user_id in preds_df.index:
        logger.info(f"Applying CF boost for user {req.user_id}")
        user_preds = preds_df.loc[req.user_id]
        for hostel in scored:
            if hostel['hostel_id'] in user_preds.index:
                cf_score = user_preds[hostel['hostel_id']]
                hostel['score'] += cf_score * 0.5  # Weight for CF

    # Sort by score descending and return top N
    scored.sort(key=lambda x: x['score'], reverse=True)
    
    logger.info(f"Returning top {req.top_n} recommendations")
    return scored[:req.top_n]

# --- Legacy endpoints ---
@app.post("/recommend/content-based")
def get_content_based(req: ContentBasedRequest):
    """Content-based filtering recommendation endpoint"""
    return recommend_content_based(req.hostel_index, req.top_n)

@app.post("/recommend/collaborative-filtering")
def get_cf(req: CFRequest):
    """Collaborative filtering recommendation endpoint"""
    return recommend_cf_svd(req.user_id, req.top_n)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)