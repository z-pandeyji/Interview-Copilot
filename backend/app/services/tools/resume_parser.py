from smolagents import tool
import re

@tool
def parse_contact_info(resume_text: str) -> dict:
    """
    Extracts basic contact and demographic information from a resume.
    
    Args:
        resume_text: The full text of the candidate's resume.
        
    Returns:
        A dictionary containing found email, phone numbers, and possible location.
    """
    # Simple regex for emails
    email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", resume_text)
    email = email_match.group(0) if email_match else None
    
    # Simple regex for phone numbers (US format loose match)
    phone_match = re.search(r"\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", resume_text)
    phone = phone_match.group(0) if phone_match else None
    
    return {
        "email": email,
        "phone": phone
    }
