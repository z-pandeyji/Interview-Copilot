from smolagents import tool

@tool
def evaluate_answer_strict(answer: str, expected_points: list[str]) -> dict:
    """
    A deterministic tool that checks if an answer contains the expected technical points.
    This prevents the LLM from hallucinating an answer is "good" when it actually missed the core concepts.
    
    Args:
        answer: The candidate's raw answer string.
        expected_points: A list of key phrases/concepts that MUST be in the answer.
        
    Returns:
        A dictionary with a boolean 'passed' flag and a list of 'missing_concepts'.
    """
    answer_lower = answer.lower()
    missing = []
    
    for point in expected_points:
        # Check if expected point is mentioned in the answer
        if point.lower() not in answer_lower:
            missing.append(point)
            
    score = ((len(expected_points) - len(missing)) / len(expected_points)) * 100 if expected_points else 100
    
    return {
        "score_percentage": score,
        "missing_concepts": missing,
        "passed": score >= 70
    }
