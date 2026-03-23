from smolagents import tool
import re

# Simple set of common business/domain keywords for extraction
DOMAIN_KEYWORDS = {
    "b2b", "b2c", "saas", "fintech", "healthtech", "ecommerce", "edtech",
    "startup", "enterprise", "remote", "hybrid", "agile", "scrum",
    "machine learning", "ai", "blockchain", "web3", "cloud", "security"
}

@tool
def extract_jd_keywords(job_description: str) -> dict:
    """
    Extracts important deterministic keywords from a job description, such as domain type and basic seniority keywords.
    
    Args:
        job_description: The raw text of the job description.
        
    Returns:
        A dictionary containing found domain keywords and inferred seniority level based on simple text matching.
    """
    words = set(re.split(r'[\s,.;:()\[\]/\\|-]', job_description.lower()))
    
    # Reconstruct some n-grams
    text_lower = job_description.lower()
    
    found_domains = []
    for domain in DOMAIN_KEYWORDS:
        if re.search(r'\b' + re.escape(domain) + r'\b', text_lower):
            found_domains.append(domain)
            
    # Simple semantic seniority check
    seniority = "Unknown"
    if any(w in text_lower for w in ["lead", "principal", "staff"]):
        seniority = "Lead"
    elif any(w in text_lower for w in ["senior", "sr", "manager"]):
        seniority = "Senior"
    elif any(w in text_lower for w in ["junior", "entry", "intern", "jr"]):
        seniority = "Junior"
    else:
        seniority = "Mid"
        
    return {
        "domains_found": found_domains,
        "inferred_seniority": seniority
    }
