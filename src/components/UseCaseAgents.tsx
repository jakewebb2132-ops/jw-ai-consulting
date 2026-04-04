import React from 'react';

export default function UseCaseAgents() {
  return (
    <div className="use-case-container">
      {/* @ts-ignore */}
      <style jsx>{`
        .use-case-container {
          --bg: #f8fafc; --surface: #ffffff; --surface2: #f0f4f8;
          --border: #e2e8f0; --border2: #cbd5e1;
          --navy: #0f172a; --slate: #1e293b; --muted: #64748b; --subtle: #94a3b8;
          --blue1: #2563eb; --blue2: #1d4ed8; --sky: #0284c7; --cyan: #38bdf8;
          --violet: #6366f1; --teal: #0d9488; --amber: #d97706; --rose: #e11d48;
          font-family: 'Inter', sans-serif;
          color: var(--navy);
        }
        .use-case-container * { box-sizing: border-box; }
        .use-case-card { margin: 0 auto; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
        .top-bar { height: 3px; background: linear-gradient(to right, var(--cyan), var(--blue1)); }
        .card-inner { padding: 28px 28px 26px; }
        .eyebrow { display: inline-flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--blue1); background: rgba(37,99,235,.07); border: 1px solid rgba(37,99,235,.18); border-radius: 20px; padding: 3px 11px; margin-bottom: 12px; }
        .eyebrow::before { content: '✦'; font-size: 8px; }
        .card-title { font-size: 20px; font-weight: 700; color: var(--navy); letter-spacing: -0.4px; margin-bottom: 5px; }
        .card-subtitle { font-size: 13px; color: var(--muted); line-height: 1.55; margin-bottom: 22px; }
        .section-label { font-size: 9.5px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 9px; }
        .step-table { width: 100%; border-collapse: collapse; border: 1px solid var(--border); border-radius: 10px; overflow: hidden; font-size: 12.5px; margin-bottom: 16px; }
        .step-table thead tr { background: var(--surface2); border-bottom: 1px solid var(--border); }
        .step-table th { padding: 9px 14px; text-align: left; font-size: 9.5px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; color: var(--muted); }
        .step-table td { padding: 7px 14px; border-bottom: 1px solid var(--border); vertical-align: middle; }
        .step-table tbody tr:last-child td { border-bottom: none; }
        .step-table tbody tr:hover { background: rgba(240,244,248,.6); }
        .step-num { font-size: 10px; color: var(--subtle); font-weight: 500; }
        .step-name { font-weight: 600; color: var(--slate); }
        .step-feature { color: var(--muted); }
        .tag { display: inline-block; font-size: 9px; font-weight: 600; padding: 2px 8px; border-radius: 5px; letter-spacing: 0.2px; white-space: nowrap; }
        .tag-indigo { background: rgba(99,102,241,.08); color: #4f46e5; border: 1px solid rgba(99,102,241,.2); }
        .tag-violet { background: rgba(99,102,241,.1); color: #6366f1; border: 1px solid rgba(99,102,241,.25); }
        .tag-sky { background: rgba(2,132,199,.08); color: #0369a1; border: 1px solid rgba(2,132,199,.2); }
        .tag-slate { background: rgba(100,116,139,.08); color: #64748b; border: 1px solid rgba(100,116,139,.2); }
        .tag-blue { background: rgba(37,99,235,.08); color: #2563eb; border: 1px solid rgba(37,99,235,.2); }
        .tag-teal { background: rgba(13,148,136,.08); color: #0d9488; border: 1px solid rgba(13,148,136,.2); }
        .tag-amber { background: rgba(217,119,6,.08); color: #d97706; border: 1px solid rgba(217,119,6,.2); }
        .tag-rose { background: rgba(225,29,72,.08); color: #e11d48; border: 1px solid rgba(225,29,72,.2); }
        .panel-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px; }
        @media (max-width: 600px) { .panel-grid { grid-template-columns: 1fr; } }
        .panel { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 15px 17px; }
        .panel-head { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
        .panel-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .panel-title { font-size: 12.5px; font-weight: 700; color: var(--navy); letter-spacing: -0.1px; }
        .mem-row { display: flex; align-items: flex-start; gap: 9px; margin-bottom: 8px; }
        .mem-row:last-child { margin-bottom: 0; }
        .mem-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--violet); flex-shrink: 0; margin-top: 5px; }
        .mem-text { font-size: 11.5px; color: var(--muted); line-height: 1.55; }
        .mem-text strong { color: var(--slate); font-weight: 600; }
        .loop-step { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
        .loop-tag { min-width: 64px; text-align: center; }
        .loop-label { font-size: 11.5px; color: var(--muted); line-height: 1.45; }
        .loop-label strong { color: var(--slate); font-weight: 600; }
        .loop-arrow { display: block; font-size: 11px; color: var(--subtle); margin-left: 28px; margin-bottom: 4px; }
        .loop-cycle { font-size: 10.5px; color: var(--subtle); margin-left: 28px; margin-top: 6px; display: block; }
        hr.divider { border: none; border-top: 1px solid var(--border); margin: 14px 0; }
        .footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
        .footer-brand { display: flex; align-items: center; gap: 8px; }
        .jw-logo { width: 24px; height: 24px; border-radius: 6px; background: linear-gradient(135deg, #2563eb, #1d4ed8); display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; color: #fff; letter-spacing: -0.5px; flex-shrink: 0; }
        .footer-label { font-size: 11.5px; color: var(--muted); font-weight: 500; }
        .badge-row { display: flex; gap: 6px; flex-wrap: wrap; }
      `}</style>
      <div className="use-case-card w-full text-left">
        <div className="top-bar"></div>
        <div className="card-inner">
          <div className="eyebrow">Use Case · Autonomous AI Agents</div>
          <h2 className="card-title">Production Claude Code Agents</h2>
          <p className="card-subtitle">A 10-step framework for deploying self-improving, memory-enabled agent systems in enterprise environments — combining Claude Code, Obsidian.ai long-term memory, and the Karpathy self-learning loop.</p>
          <p className="section-label">Core Build Framework</p>
          <table className="step-table">
            <thead><tr><th>Step</th><th>Name</th><th>Claude Code Feature</th><th>File / Location</th></tr></thead>
            <tbody>
              <tr><td><span className="step-num">01</span></td><td className="step-name">Define role</td><td className="step-feature">Agent frontmatter</td><td><span className="tag tag-indigo">.claude/agents/*.md</span></td></tr>
              <tr><td><span className="step-num">02</span></td><td className="step-name">Design I/O</td><td className="step-feature">Skills with arguments</td><td><span className="tag tag-indigo">.claude/skills/*/SKILL.md</span></td></tr>
              <tr><td><span className="step-num">03</span></td><td className="step-name">Tune behavior</td><td className="step-feature">CLAUDE.md + modular rules</td><td><span className="tag tag-indigo">.claude/rules/*.md</span></td></tr>
              <tr><td><span className="step-num">04</span></td><td className="step-name">Add tools</td><td className="step-feature">tools: field + hooks</td><td><span className="tag tag-slate">Agent frontmatter</span></td></tr>
              <tr><td><span className="step-num">05</span></td><td className="step-name">Multi-agent</td><td className="step-feature">Subagents / Agent Teams</td><td><span className="tag tag-indigo">.claude/agents/*.md</span></td></tr>
              <tr><td><span className="step-num">06</span></td><td className="step-name">Memory</td><td className="step-feature">memory: field + Obsidian.ai</td><td><span className="tag tag-violet">Long-term vault</span></td></tr>
              <tr><td><span className="step-num">07</span></td><td className="step-name">External access</td><td className="step-feature">MCP servers</td><td><span className="tag tag-sky">claude mcp add</span></td></tr>
              <tr><td><span className="step-num">08</span></td><td className="step-name">Output</td><td className="step-feature">Skills + slash commands</td><td><span className="tag tag-indigo">.claude/commands/*.md</span></td></tr>
              <tr><td><span className="step-num">09</span></td><td className="step-name">UI / Control</td><td className="step-feature">Remote Control + OpenClaw</td><td><span className="tag tag-slate">Telegram / messaging</span></td></tr>
              <tr><td><span className="step-num">10</span></td><td className="step-name">Monitor</td><td className="step-feature">Hooks (Pre / Post / Stop)</td><td><span className="tag tag-sky">settings.json</span></td></tr>
            </tbody>
          </table>
          <div className="panel-grid">
            <div className="panel">
              <div className="panel-head">
                <div className="panel-dot" style={{ background: "linear-gradient(135deg,#818cf8,#6366f1)" }}></div>
                <span className="panel-title">Obsidian.ai — Long-Term Memory</span>
              </div>
              <div className="mem-row"><div className="mem-dot"></div><p className="mem-text"><strong>Persistent vault</strong> — learnings, decisions, and outcomes written back to Obsidian notes after each run</p></div>
              <div className="mem-row"><div className="mem-dot"></div><p className="mem-text"><strong>Semantic recall</strong> — linked notes surface relevant context across sessions via graph-aware retrieval</p></div>
              <div className="mem-row"><div className="mem-dot"></div><p className="mem-text"><strong>Auto-tagging</strong> — AI classifies memory entries by task type, outcome, and domain for fast lookup</p></div>
              <div className="mem-row"><div className="mem-dot"></div><p className="mem-text"><strong>MCP bridge</strong> — agents read/write the vault via MCP, keeping memory outside the context window</p></div>
            </div>
            <div className="panel">
              <div className="panel-head">
                <div className="panel-dot" style={{ background: "linear-gradient(135deg,#38bdf8,#2563eb)" }}></div>
                <span className="panel-title">Karpathy Self-Learning Loop</span>
              </div>
              <div className="loop-step"><span className="tag tag-teal loop-tag">Execute</span><span className="loop-label">Agent runs task, logs <strong>inputs + outputs</strong></span></div>
              <span className="loop-arrow">↓</span>
              <div className="loop-step"><span className="tag tag-amber loop-tag">Evaluate</span><span className="loop-label">Score result vs expected — <strong>auto or human</strong></span></div>
              <span className="loop-arrow">↓</span>
              <div className="loop-step"><span className="tag tag-sky loop-tag">Reflect</span><span className="loop-label">LLM reflects on gap, <strong>writes note</strong> to Obsidian</span></div>
              <span className="loop-arrow">↓</span>
              <div className="loop-step"><span className="tag tag-indigo loop-tag">Update</span><span className="loop-label">Revise SKILL.md or rules — <strong>loop closed</strong></span></div>
              <span className="loop-cycle">↻ continuous improvement</span>
            </div>
          </div>
          <hr className="divider" />
          <div className="footer">
            <div className="footer-brand">
              <div className="jw-logo">JW</div>
              <span className="footer-label">JW AI Consulting · jwaiconsulting.com</span>
            </div>
            <div className="badge-row">
              <span className="tag tag-blue">Claude Code</span>
              <span className="tag tag-indigo">Multi-Agent</span>
              <span className="tag tag-sky">MCP</span>
              <span className="tag tag-violet">Obsidian.ai</span>
              <span className="tag tag-rose">Karpathy Loop</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
