import asyncio
from app.services.agents.orchestrator import run_pipeline
from app.services.llm import _get_config

async def main():
    resume = """
    John Doe
    john@example.com | (555) 123-4567
    
    Senior React Developer with 5 years experience.
    Skills: React, Next.js, TypeScript, Python, Tailwind.
    
    Experience:
    Frontend Engineer at Vercel (2020 - Present)
    - Built web apps with React.
    """
    
    jd = """
    Company: Tech Corp
    Role: Senior Frontend Engineer
    
    Must have skills:
    - React
    - TypeScript
    - Go
    """
    
    print("Running pipeline...")
    result = await run_pipeline(resume, jd)
    print("Result generated successfully!")
    print(result.model_dump_json(indent=2))

if __name__ == "__main__":
    asyncio.run(main())
