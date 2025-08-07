from flask import Flask, request, jsonify
import json
from parser import extract_text_from_pdf
from scorer import calculate_match_score

app = Flask(__name__)

@app.route('/api/score', methods=['POST'])
def score_resume():
    # Check if a resume file was provided in the request
    if 'resume' not in request.files:
        return jsonify({"error": "No resume file provided"}), 400

    file = request.files['resume']
    
    # Check if the file is empty
    if file.filename == '':
        return jsonify({"error": "Empty file provided"}), 400

    # Extract job details from the form data
    job_description = request.form.get('job_description', '')
    required_skills_json = request.form.get('required_skills', '[]')
    
    try:
        required_skills = json.loads(required_skills_json)
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON format for required_skills"}), 400

    # Process the file and score it
    if file:
        resume_text = extract_text_from_pdf(file.stream)
        if not resume_text:
            return jsonify({"error": "Could not extract text from PDF"}), 500
            
        result = calculate_match_score(resume_text, job_description, required_skills)
        return jsonify(result), 200

    return jsonify({"error": "An unexpected error occurred"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)