import React, { useState, useEffect, useCallback, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Search, Lightbulb, Share2, Loader2, BookOpen, Layers, Cpu, Globe, Database } from 'lucide-react';
import './index.css';

const API_BASE = 'http://127.0.0.1:8000';

function App() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState('');
  const [status, setStatus] = useState('');
  const fgRef = useRef();

  const fetchGraph = useCallback(async (currentTopic) => {
    try {
      const res = await axios.get(`${API_BASE}/graph`);
      const { nodes, edges } = res.data;
      
      const formattedNodes = nodes.map(id => {
        let nodeType = 'concept';
        let color = '#aff5b4';
        let size = 4;

        if (id === currentTopic) {
          nodeType = 'topic';
          color = '#be95ff'; // Vibrant Purple for Center
          size = 12;
        } else if (id.length > 30 || (id.includes(' ') && id.length > 20)) {
          // Heuristic for paper titles: longer IDs usually are titles
          nodeType = 'paper';
          color = '#58a6ff';
          size = 8;
        }

        return { id, color, size, nodeType };
      });
      
      const formattedLinks = edges.map(([source, target]) => ({
        source,
        target,
        color: 'rgba(88, 166, 255, 0.4)' // Increased visibility with a blue tint
      }));
      
      setGraphData({ nodes: formattedNodes, links: formattedLinks });
      
      // Focus on the topic node if it exists
      if (currentTopic && fgRef.current) {
        const topicNode = formattedNodes.find(n => n.id === currentTopic);
        if (topicNode) {
          fgRef.current.centerAt(topicNode.x, topicNode.y, 1000);
          fgRef.current.zoom(2, 1000);
        }
      }
    } catch (err) {
      console.error("Failed to fetch graph", err);
    }
  }, []);

  useEffect(() => {
    fetchGraph(topic);
  }, [fetchGraph]);

  useEffect(() => {
    if (fgRef.current) {
      // De-tune the global repulsion to stop unrelated nodes from moving
      fgRef.current.d3Force('charge').strength(-40).distanceMax(150);
      
      // Strengthen the links to keep structures together
      fgRef.current.d3Force('link').distance(40).strength(1);
      
      // Reduce centering force effect so clusters don't pull each other globally
      fgRef.current.d3Force('center', null); 
    }
  }, [graphData]);

  const handleAnalyze = async () => {
    if (!topic) return;
    setLoading(true);
    setStatus('Mining research papers...');
    try {
      await axios.post(`${API_BASE}/analyze-paper`, { topic });
      setStatus('Knowledge graph updated!');
      await fetchGraph(topic);
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      console.error(err);
      setStatus('Analysis failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateIdeas = async () => {
    setLoading(true);
    setStatus('Generating AI insights...');
    try {
      const res = await axios.get(`${API_BASE}/research-ideas`);
      setIdeas(res.data.return_ideas);
      setStatus('Insights ready!');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      console.error(err);
      setStatus('Idea generation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">

        {/* Brand */}
        <header className="brand">
          <div className="logo-wrapper">
            <Layers className="logo-icon" size={22} />
          </div>
          <div className="brand-text">
            <h1>ResearchGraph</h1>
            <p>AI-Powered Discovery</p>
          </div>
        </header>

        {/* Search */}
        <section className="search-box">
          <span className="search-label">Search Topic</span>
          <div className="input-glow-container">
            <input
              type="text"
              placeholder="e.g. Quantum Computing..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
            />
            <button className="search-trigger" onClick={handleAnalyze} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
            </button>
          </div>
        </section>

        {/* Generate */}
        <section className="actions">
          <button
            className="action-btn primary"
            onClick={handleGenerateIdeas}
            disabled={loading || graphData.nodes.length === 0}
          >
            <Lightbulb size={16} />
            <span>Generate Research Ideas</span>
          </button>
        </section>

        {/* AI Panel */}
        <section className="insights-panel">
          <div className="panel-header">
            <Cpu size={13} />
            <span>AI Analysis</span>
          </div>
          <div className="insights-content">
            {!ideas && !loading && (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Globe size={22} />
                </div>
                <p>Search a topic to build your knowledge graph, then generate ideas to explore connections.</p>
              </div>
            )}
            {ideas && (
              <div className="ideas-markdown">
                <ReactMarkdown>{ideas}</ReactMarkdown>
              </div>
            )}
          </div>
        </section>

        {/* Stats Footer */}
        <footer className="sidebar-footer">
          <Database size={13} />
          <span>{graphData.nodes.length} nodes</span>
          <span className="separator">·</span>
          <span>{graphData.links.length} links</span>
        </footer>

      </aside>

      {/* Graph Viewport */}
      <main className="viewport">

        {loading && (
          <div className="ui-overlay">
            <div className="dynamic-loader">
              <div className="ring" />
              <span>{status}</span>
            </div>
          </div>
        )}

        {status && !loading && (
          <div className="toast-notification active">{status}</div>
        )}

        <ForceGraph2D
          ref={fgRef}
          graphData={graphData}
          nodeLabel="id"
          nodeColor={node => node.color}
          nodeVal={node => node.size}
          linkColor={link => link.color}
          linkWidth={1.5}
          linkDirectionalParticles={3}
          linkDirectionalParticleSpeed={0.005}
          linkDirectionalParticleWidth={2.0}
          backgroundColor="#060810"
          d3VelocityDecay={0.6}
          d3AlphaDecay={0.05}
          cooldownTicks={50}
          warmupTicks={0}
          onNodeDrag={(node) => {
            node.fx = node.x;
            node.fy = node.y;
          }}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const r = node.size;
            const label = node.id;
            const isTopic = node.nodeType === 'topic';
            const isPaper = node.nodeType === 'paper';

            // Glow effect
            if (isTopic) {
              ctx.shadowColor = '#be95ff';
              ctx.shadowBlur = 20;
            } else if (isPaper) {
              ctx.shadowColor = '#58a6ff';
              ctx.shadowBlur = 10;
            } else {
              ctx.shadowBlur = 0;
            }

            // Draw circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
            ctx.fillStyle = node.color;
            ctx.fill();
            ctx.shadowBlur = 0;

            // Outer ring for topic
            if (isTopic) {
              ctx.beginPath();
              ctx.arc(node.x, node.y, r + 3, 0, 2 * Math.PI, false);
              ctx.strokeStyle = 'rgba(190, 149, 255, 0.45)';
              ctx.lineWidth = 1.5;
              ctx.stroke();
              // Second outer ring
              ctx.beginPath();
              ctx.arc(node.x, node.y, r + 6, 0, 2 * Math.PI, false);
              ctx.strokeStyle = 'rgba(190, 149, 255, 0.15)';
              ctx.lineWidth = 1;
              ctx.stroke();
            }

            // Label
            const fontSize = Math.max(isTopic ? 7 : 10 / globalScale, 2.5);
            ctx.font = `${isTopic ? '700' : '400'} ${fontSize}px Inter, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';

            const textW = ctx.measureText(label).width;
            const padX = fontSize * 0.5;
            const padY = fontSize * 0.3;
            const bx = node.x - textW / 2 - padX;
            const by = node.y + r + 4;
            const bw = textW + padX * 2;
            const bh = fontSize + padY * 2;

            // Label background (plain rect — safe cross-browser)
            ctx.fillStyle = 'rgba(6, 8, 16, 0.82)';
            ctx.fillRect(bx, by, bw, bh);

            // Label text
            ctx.fillStyle = isTopic ? '#be95ff' : isPaper ? '#b8d0f0' : '#9fceaa';
            ctx.fillText(label, node.x, by + padY);
          }}
          onNodeDragEnd={node => {
            node.fx = node.x;
            node.fy = node.y;
          }}
        />

        {/* Legend */}
        <div className="graph-controls">
          <div className="legend-item">
            <span className="dot topic"></span>
            Center Topic
          </div>
          <div className="legend-divider"></div>
          <div className="legend-item">
            <span className="dot paper"></span>
            Research Paper
          </div>
          <div className="legend-divider"></div>
          <div className="legend-item">
            <span className="dot concept"></span>
            Concept
          </div>
          <div className="legend-divider"></div>
          <div className="legend-item">
            <span className="line connection"></span>
            Connection
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;
