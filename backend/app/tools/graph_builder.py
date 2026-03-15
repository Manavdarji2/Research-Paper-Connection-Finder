import networkx as nx

graph = nx.Graph()

def add_paper_concept(topic, paper_title, concepts):
    graph.add_edge(topic, paper_title)
    for concept in concepts:
        graph.add_edge(paper_title, concept)

def get_graph_data():
    nodes = list(graph.nodes)
    edges = [list(e) for e in graph.edges] # Convert to serializable format
    return {"nodes": nodes, "edges": edges}