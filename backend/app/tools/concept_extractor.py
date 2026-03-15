from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os
load_dotenv()

async def extract_concepts(abstract:str):
    llm=ChatOpenAI(
        base_url="https://openrouter.ai/api/v1",
        model=os.getenv("MODEL_NAME"),
        api_key=os.getenv('OPENROUTER_API_KEY'),
        temperature=0.2,
    )
    prompt=f"""
    Extract important research concepts from this paper abstract.
    Return ONLY a short list of keywords.
    Abstract: {abstract}
    """
    response = await llm.ainvoke(prompt)

    concept = response.content
    return concept
