import requests
import xml.etree.ElementTree as ET

async def search_papers(topic: str):
    url = f"https://export.arxiv.org/api/query?search_query=all:{topic}&start=0&max_results=5"
    response = requests.get(url)
    root = ET.fromstring(response.text)

    results = []
    for entry in root.findall("{http://www.w3.org/2005/Atom}entry"):
        title = entry.find("{http://www.w3.org/2005/Atom}title").text
        summary = entry.find("{http://www.w3.org/2005/Atom}summary").text
        link = entry.find("{http://www.w3.org/2005/Atom}id").text
        results.append({"title": title, "summary": summary, "link": link})
    return results