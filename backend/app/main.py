from fastapi import FastAPI
from backend.app.tools.search_papers import search_papers
from backend.app.tools.concept_extractor import extract_concepts
from backend.app.tools.graph_builder import add_paper_concept, get_graph_data
from backend.app.tools.connection_finder import find_connections
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import uvicorn

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, this should be restricted to the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def health_check():
    return {"status":"ok"}

@app.get('/search')
async def search(topic:str):
    result=await search_papers(topic)
    return {"result":result}

@app.post('/extract-concept')
async def extract(data:dict):
    abstract=data["abstract"]

    concept=await extract_concepts(abstract)
    return {"concept":concept}
@app.post('/analyze-paper')
async def analyze_paper(data:dict):
    topic=data['topic']
    papers=await search_papers(topic)
    result=[]

    for paper in papers:
        title=paper['title']
        abstract=paper['summary']
        concept=await extract_concepts(abstract)

        concept_list=[c.strip() for c in concept.split("\n") if c.strip()]
        add_paper_concept(topic, title, concept_list)
        result.append({"title":title ,"concept":concept_list})
    return {
        "topic":topic, 
        "papers_analyzed":len(result),
        "results":result
    }

@app.get('/graph')
def graph():
    return get_graph_data()

@app.get("/research-ideas")
async def research_ideas():
    ideas=await find_connections()
    
    return {
        "return_ideas":ideas
    }
if __name__ == "__main__":
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)

    