from smolagents import tool
import re

# A simple hardcoded database of known tech skills for deterministic matching
KNOWN_SKILLS = {
    "javascript", "typescript", "python", "java", "c++", "c#", "go", "rust",
    "react", "angular", "vue", "next.js", "node.js", "django", "fastapi", "flask",
    "aws", "azure", "gcp", "docker", "kubernetes", "sql", "mysql", "postgresql",
    "mongodb", "redis", "graphql", "rest", "linux", "git", "ci/cd", "terraform",
    "machine learning", "pytorch", "tensorflow", "llms", "genai", "pandas"
}

@tool
def extract_verified_skills(text: str) -> list[str]:
    """
    Scans text (like a resume or JD) and extracts an array of verified technical skills 
    by matching against a known database of technologies. Use this to quickly 
    determine hard technical skills present in a document without hallucinating.
    
    Args:
        text: The raw text of a resume or job description to scan.
        
    Returns:
        A list of standardized tech skill strings found in the text.
    """
    # Normalize text: lowercase and split by non-word characters
    # (Using a simple regex split instead of heavy NLP for speed)
    words = re.split(r'[\s,.;:()\[\]/\\|-]', text.lower())
    words = [w.strip() for w in words if w.strip()]
    
    # Reconstruct some n-grams (e.g., "machine", "learning" -> "machine learning")
    text_lower = " ".join(words)
    
    found_skills = set()
    for skill in KNOWN_SKILLS:
        # Simple whole word match
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text.lower()):
            found_skills.add(skill)
            
    return sorted(list(found_skills))
