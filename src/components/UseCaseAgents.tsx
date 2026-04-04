const css = `
.uca-wrap *, .uca-wrap *::before, .uca-wrap *::after { box-sizing: border-box; margin: 0; padding: 0; }
.uca-wrap {
  --bg: #f8fafc; --surface: #ffffff; --surface2: #f0f4f8;
  --border: #e2e8f0; --border2: #cbd5e1;
  --navy: #0f172a; --slate: #1e293b; --muted: #64748b; --subtle: #94a3b8;
  --blue1: #2563eb; --blue2: #1d4ed8; --sky: #0284c7; --cyan: #38bdf8;
  --violet: #6366f1; --teal: #0d9488; --amber: #d97706; --rose: #e11d48;
  font-family: 'Inter', sans-serif;
  background: var(--bg);
  color: var(--navy);
  padding: 32px 16px;
}
.uca-card { max-width: 780px; margin: 0 auto; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
.uca-top-bar { height: 3px; background: linear-gradient(to right, var(--cyan), var(--blue1)); }
.uca-inner { padding: 28px 28px 26px; }
.uca-eyebrow { display: inline-flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--blue1); background: rgba(37,99,235,.07); border: 1px solid rgba(37,99,235,.18); border-radius: 20px; padding: 3px 11px; margin-bottom: 12px; }
.uca-eyebrow::before { content: '✦'; font-size: 8px; }
.uca-title { font-size: 20px; font-weight: 700; color: var(--navy); letter-spacing: -0.4px; margin-bottom: 5px; }
.uca-subtitle { font-size: 13px; color: var(--muted); line-height: 1.55; margin-bottom: 22px; }
.uca-section-label { font-size: 9.5px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 9px; }
.uca-step-table { width: 100%; border-collapse: collapse; border: 1px solid var(--border); border-radius: 10px; overflow: hidden; font-size: 12.5px; margin-bottom: 16px; }
.uca-step-table thead tr { background: var(--surface2); border-bottom: 1px solid var(--border); }
.uca-step-table th { padding: 9px 14px; text-align: left; font-size: 9.5px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; color: var(--muted); }
.uca-step-table td { padding: 7px 14px; border-bottom: 1px solid var(--border); vertical-align: middle; }
.uca-step-table tbody tr:last-child td { border-bottom: none; }
.uca-step-table tbody tr:hover { background: rgba(240,244,248,.6); }
.uca-step-num { font-size: 10px; color: var(--subtle); font-weight: 500; }
.uca-step-name { font-weight: 600; color: var(--slate); }
.uca-step-feature { color: var(--muted); }
.uca-tag { display: inline-block; font-size: 9px; font-weight: 600; padding: 2px 8px; border-radius: 5px; letter-spacing: 0.2px; white-space: nowrap; }
.uca-tag-indigo { background: rgba(99,102,241,.08); color: #4f46e5; border: 1px solid rgba(99,102,241,.2); }
.uca-tag-violet { background: rgba(99,102,241,.1); color: #6366f1; border: 1px solid rgba(99,102,241,.25); }
.uca-tag-sky { background: rgba(2,132,199,.08); color: #0369a1; border: 1px solid rgba(2,132,199,.2); }
.uca-tag-slate { background: rgba(100,116,139,.08); color: #64748b; border: 1px solid rgba(100,116,139,.2); }
.uca-tag-blue { background: rgba(37,99,235,.08); color: #2563eb; border: 1px solid rgba(37,99,235,.2); }
.uca-tag-teal { background: rgba(13,148,136,.08); color: #0d9488; border: 1px solid rgba(13,148,136,.2); }
.uca-tag-amber { background: rgba(217,119,6,.08); color: #d97706; border: 1px solid rgba(217,119,6,.2); }
.uca-tag-rose { background: rgba(225,29,72,.08); color: #e11d48; border: 1px solid rgba(225,29,72,.2); }
.uca-panel-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px; }
@media (max-width: 600px) { .uca-panel-grid { grid-template-columns: 1fr; } }
.uca-panel { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 15px 17px; }
.uca-panel-head { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.uca-panel-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.uca-panel-title { font-size: 12.5px; font-weight: 700; color: var(--navy); letter-spacing: -0.1px; }
.uca-mem-row { display: flex; align-items: flex-start; gap: 9px; margin-bottom: 8px; }
.uca-mem-row:last-child { margin-bottom: 0; }
.uca-mem-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--violet); flex-shrink: 0; margin-top: 5px; }
.uca-mem-text { font-size: 11.5px; color: var(--muted); line-height: 1.55; }
.uca-mem-text strong { color: var(--slate); font-weight: 600; }
.uca-loop-step { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.uca-loop-tag { min-width: 64px; text-align: center; }
.uca-loop-label { font-size: 11.5px; color: var(--muted); line-height: 1.45; }
.uca-loop-label strong { color: var(--slate); font-weight: 600; }
.uca-loop-arrow { display: block; font-size: 11px; color: var(--subtle); margin-left: 28px; margin-bottom: 4px; }
.uca-loop-cycle { font-size: 10.5px; color: var(--subtle); margin-left: 28px; margin-top: 6px; display: block; }
.uca-divider { border: none; border-top: 1px solid var(--border); margin: 14px 0; }
.uca-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
.uca-footer-brand { display: flex; align-items: center; gap: 8px; }
.uca-jw-logo { width: 24px; height: 24px; border-radius: 6px; background: linear-gradient(135deg, #2563eb, #1d4ed8); display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; color: #fff; letter-spacing: -0.5px; flex-shrink: 0; }
.uca-footer-label { font-size: 11.5px; color: var(--muted); font-weight: 500; }
.uca-badge-row { display: flex; gap: 6px; flex-wrap: wrap; }
`;

const steps = [
  { num: '01', name: 'Define role',     feature: 'Agent frontmatter',        tag: 'indigo', file: '.claude/agents/*.md' },
  { num: '02', name: 'Design I/O',      feature: 'Skills with arguments',    tag: 'indigo', file: '.claude/skills/*/SKILL.md' },
  { num: '03', name: 'Tune behavior',   feature: 'CLAUDE.md + modular rules',tag: 'indigo', file: '.claude/rules/*.md' },
  { num: '04', name: 'Add tools',       feature: 'tools: field + hooks',     tag: 'slate',  file: 'Agent frontmatter' },
  { num: '05', name: 'Multi-agent',     feature: 'Subagents / Agent Teams',  tag: 'indigo', file: '.claude/agents/*.md' },
  { num: '06', name: 'Memory',          feature: 'memory: field + Obsidian.ai', tag: 'violet', file: 'Long-term vault' },
  { num: '07', name: 'External access', feature: 'MCP servers',              tag: 'sky',    file: 'claude mcp add' },
  { num: '08', name: 'Output',          feature: 'Skills + slash commands',  tag: 'indigo', file: '.claude/commands/*.md' },
  { num: '09', name: 'UI / Control',    feature: 'Remote Control + OpenClaw',tag: 'slate',  file: 'Telegram / messaging' },
  { num: '10', name: 'Monitor',         feature: 'Hooks (Pre / Post / Stop)',tag: 'sky',    file: 'settings.json' },
];

const memoryItems = [
  { label: 'Persistent vault', desc: '— learnings, decisions, and outcomes written back to Obsidian notes after each run' },
  { label: 'Semantic recall',  desc: '— linked notes surface relevant context across sessions via graph-aware retrieval' },
  { label: 'Auto-tagging',     desc: '— AI classifies memory entries by task type, outcome, and domain for fast lookup' },
  { label: 'MCP bridge',       desc: '— agents read/write the vault via MCP, keeping memory outside the context window' },
];

const loopSteps = [
  { tag: 'teal',   label: 'Execute', desc: <>Agent runs task, logs <strong>inputs + outputs</strong></> },
  { tag: 'amber',  label: 'Evaluate', desc: <>Score result vs expected — <strong>auto or human</strong></> },
  { tag: 'sky',    label: 'Reflect', desc: <>LLM reflects on gap, <strong>writes note</strong> to Obsidian</> },
  { tag: 'indigo', label: 'Update',  desc: <>Revise SKILL.md or rules — <strong>loop closed</strong></> },
];

const footerBadges = [
  { tag: 'blue',   label: 'Claude Code' },
  { tag: 'indigo', label: 'Multi-Agent' },
  { tag: 'sky',    label: 'MCP' },
  { tag: 'violet', label: 'Obsidian.ai' },
  { tag: 'rose',   label: 'Karpathy Loop' },
];

export default function UseCaseAgents() {
  return (
    <div className="uca-wrap">
      <style>{css}</style>

      <div className="uca-card">
        <div className="uca-top-bar" />
        <div className="uca-inner">

          <div className="uca-eyebrow">Use Case · Autonomous AI Agents</div>
          <h2 className="uca-title">Production Claude Code Agents</h2>
          <p className="uca-subtitle">
            A 10-step framework for deploying self-improving, memory-enabled agent systems in enterprise
            environments — combining Claude Code, Obsidian.ai long-term memory, and the Karpathy self-learning loop.
          </p>

          <p className="uca-section-label">Core Build Framework</p>
          <table className="uca-step-table">
            <thead>
              <tr>
                <th>Step</th>
                <th>Name</th>
                <th>Claude Code Feature</th>
                <th>File / Location</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((s) => (
                <tr key={s.num}>
                  <td><span className="uca-step-num">{s.num}</span></td>
                  <td className="uca-step-name">{s.name}</td>
                  <td className="uca-step-feature">{s.feature}</td>
                  <td><span className={`uca-tag uca-tag-${s.tag}`}>{s.file}</span></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="uca-panel-grid">
            {/* Obsidian panel */}
            <div className="uca-panel">
              <div className="uca-panel-head">
                <div className="uca-panel-dot" style={{ background: 'linear-gradient(135deg,#818cf8,#6366f1)' }} />
                <span className="uca-panel-title">Obsidian.ai — Long-Term Memory</span>
              </div>
              {memoryItems.map((m) => (
                <div className="uca-mem-row" key={m.label}>
                  <div className="uca-mem-dot" />
                  <p className="uca-mem-text"><strong>{m.label}</strong> {m.desc}</p>
                </div>
              ))}
            </div>

            {/* Karpathy panel */}
            <div className="uca-panel">
              <div className="uca-panel-head">
                <div className="uca-panel-dot" style={{ background: 'linear-gradient(135deg,#38bdf8,#2563eb)' }} />
                <span className="uca-panel-title">Karpathy Self-Learning Loop</span>
              </div>
              {loopSteps.map((ls, i) => (
                <div key={ls.label}>
                  <div className="uca-loop-step">
                    <span className={`uca-tag uca-tag-${ls.tag} uca-loop-tag`}>{ls.label}</span>
                    <span className="uca-loop-label">{ls.desc}</span>
                  </div>
                  {i < loopSteps.length - 1 && <span className="uca-loop-arrow">↓</span>}
                </div>
              ))}
              <span className="uca-loop-cycle">↻ continuous improvement</span>
            </div>
          </div>

          <hr className="uca-divider" />

          <div className="uca-footer">
            <div className="uca-footer-brand">
              <div className="uca-jw-logo">JW</div>
              <span className="uca-footer-label">JW AI Consulting · jwaiconsulting.com</span>
            </div>
            <div className="uca-badge-row">
              {footerBadges.map((b) => (
                <span key={b.label} className={`uca-tag uca-tag-${b.tag}`}>{b.label}</span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
