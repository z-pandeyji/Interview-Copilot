from smolagents import tool
import json

# A dummy database of questions
QUESTIONS_DB = [
    {
        "id": "Q001",
        "topic": "react",
        "difficulty": "mid",
        "question": "Explain the difference between useEffect and useLayoutEffect. When would you use one over the other?",
        "expected_points": ["useEffect is async", "useLayoutEffect is sync", "useLayoutEffect blocks DOM painting"]
    },
    {
        "id": "Q002",
        "topic": "python",
        "difficulty": "senior",
        "question": "How does Python's Global Interpreter Lock (GIL) impact multithreading? How can you bypass it?",
        "expected_points": ["GIL prevents multiple native threads from executing Python bytecodes at once", "multiprocessing module", "C extensions"]
    },
    {
        "id": "Q003",
        "topic": "system design",
        "difficulty": "senior",
        "question": "How would you design a rate limiter for a public API?",
        "expected_points": ["Token bucket algorithm", "Redis for storage", "Handling distributed systems"]
    },
    {
        "id": "Q004",
        "topic": "javascript",
        "difficulty": "junior",
        "question": "What is event bubbling in the DOM?",
        "expected_points": ["Events propagate from innermost target element up through ancestors", "stopPropagation()"]
    },
    {
        "id": "Q005",
        "topic": "behavioral",
        "difficulty": "mid",
        "question": "Tell me about a time you had a crucial disagreement with a team member about a technical choice. How did you resolve it?",
        "expected_points": ["Data-driven approach", "Compromise", "Communication skills", "Focus on user/business impact"]
    }
]

@tool
def retrieve_questions(topic: str, difficulty: str) -> str:
    """
    Simulates retrieving technical or behavioral interview questions from a company database.
    
    Args:
        topic: The primary skill or subject area (e.g., "react", "python", "behavioral", "system design").
        difficulty: The target level ("junior", "mid", "senior").
        
    Returns:
        A JSON string containing a list of matched question objects, including the question text and expected key points.
    """
    matches = []
    topic_lower = topic.lower()
    diff_lower = difficulty.lower()
    
    for q in QUESTIONS_DB:
        if q["topic"].lower() == topic_lower and q["difficulty"].lower() == diff_lower:
            matches.append(q)
            
    # If no exact match, return anything for the same topic
    if not matches:
        for q in QUESTIONS_DB:
            if q["topic"].lower() == topic_lower:
                matches.append(q)
                
    if not matches:
        return json.dumps([{"error": f"No questions found for topic '{topic}'. Generator should fallback to inventing its own."}])
        
    return json.dumps(matches, indent=2)
