import re
import nltk
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# --- NEW: Download French stopwords and add them to the list ---
try:
    # Ensure stopwords for both English and French are available
    stopwords.words('english')
    stopwords.words('french')
except LookupError:
    nltk.download('stopwords')

# Combine stopwords from both languages for multilingual support
stop_words = set(stopwords.words('english')).union(set(stopwords.words('french')))

def preprocess_text(text):
    """Cleans and preprocesses text by lowercasing and removing non-alphanumeric characters."""
    text = text.lower()
    text = re.sub(r'\s+', ' ', text)
    # --- UPDATED: The regex now includes accented characters for French support ---
    text = re.sub(r'[^a-z0-9\sàâçéèêëîïôûùüÿñæœ]', '', text)
    return text

def calculate_match_score(resume_text, job_description, required_skills):
    """
    Calculates a more advanced match score by analyzing skills, experience,
    and education keywords.
    """
    
    # 1. Preprocess all text inputs
    processed_resume = preprocess_text(resume_text)
    processed_job_desc = preprocess_text(job_description)
    
    # 2. Calculate overall similarity (remains the same)
    vectorizer = TfidfVectorizer(stop_words=list(stop_words))
    tfidf_matrix = vectorizer.fit_transform([processed_resume, processed_job_desc])
    cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    
    # 3. Find which of the required skills are mentioned in the resume
    matched_skills = []
    if required_skills:
      for skill in required_skills:
          if re.search(r'\b' + re.escape(preprocess_text(skill)) + r'\b', processed_resume):
              matched_skills.append(skill)
            
    skill_match_percentage = len(matched_skills) / len(required_skills) if required_skills else 0

    # --- NEW: Bonus scoring for keywords found in relevant sections ---
    # We will simulate finding sections by looking for keywords like 'experience', 'education', etc.
    # In a more advanced system, you'd parse the resume structure more deeply.
    experience_bonus = 0
    education_bonus = 0

    # Check for keywords from the job description within the resume text
    job_keywords = set(processed_job_desc.split()) - stop_words
    
    # Rough check if keywords appear near "experience" or "education" headings
    if "experience" in processed_resume or "professional experience" in processed_resume:
        for keyword in job_keywords:
            if len(keyword) > 2 and keyword in processed_resume:
                experience_bonus += 0.05 # Add a small bonus for each keyword match

    if "education" in processed_resume:
         for keyword in job_keywords:
            if len(keyword) > 2 and keyword in processed_resume:
                education_bonus += 0.02 # A smaller bonus for education section matches

    # Cap the bonuses to prevent them from having too much influence
    experience_bonus = min(experience_bonus, 0.2) # Max 20% bonus
    education_bonus = min(education_bonus, 0.1) # Max 10% bonus
    
    # 4. Combine scores into a final score out of 10
    # Weights: 50% for specific skills, 30% for overall similarity, 20% for bonuses
    final_score = (skill_match_percentage * 0.5 + cosine_sim * 0.3 + experience_bonus + education_bonus) * 10
    final_score = min(round(final_score, 1), 10.0)

    return {
        "score": final_score,
        "matched_skills": matched_skills,
        "details": {
            "cosine_similarity": round(cosine_sim, 2),
            "skill_match_percent": round(skill_match_percentage * 100, 2),
            "bonus_points": round((experience_bonus + education_bonus) * 10, 2)
        }
    }