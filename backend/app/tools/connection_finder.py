from backend.app.tools.graph_builder import get_graph_data
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os

load_dotenv()

async def find_connections():
    graph_data = get_graph_data()
    nodes = graph_data['nodes']
    edges = graph_data['edges']

    if not nodes:
        return "No concepts found. Analyze some papers first."

    llm = ChatOpenAI(
        base_url="https://openrouter.ai/api/v1",
        model=os.getenv("MODEL_NAME", "google/gemma-3-4b-it:free"),
        api_key=os.getenv('OPENROUTER_API_KEY'),
    )

    prompt = f"""
    Analyze the following research concept graph:

    Nodes:
    {nodes}

    Edges:
    {edges}

    Find interesting research hidden relationships between concepts and suggest possible new research ideas based on the provided graph.
    
    Return the results in a well-formatted Markdown structure.
    Use headings (###), bullet points, and bold text for clarity.
    Focus on making the suggestions sound expert and insightful.
    
    Structure:
    ### Idea 1: [Title]
    **Description**: [Detailed description]
    **Potential Impact**: [Why it matters]
    
    (Repeat for 3 ideas)
    """
    
    response = await llm.ainvoke(prompt)
    return response.content

    
