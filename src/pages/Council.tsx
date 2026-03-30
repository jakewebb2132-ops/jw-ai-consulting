import React, { useState, useMemo } from 'react';
import { ArrowRight, CircleNotch, Warning, ChartLineUp, Users, PresentationChart, Sword, Handshake } from 'phosphor-react';
import { Link } from 'react-router-dom';

interface Advisor {
  id: string;
  name: string;
  role: string;
  lens: string;
  initials: string;
  portrait: string;
  bg: string;
  fg: string;
  persona: string;
}

const ADVISORS: Advisor[] = [
  {
    id: 'elon',
    name: 'Elon Musk',
    role: 'CEO Tesla & SpaceX · xAI Founder',
    lens: 'First-principles accelerationist',
    initials: 'E',
    portrait: '/portraits/elon_musk.png',
    bg: '#1a1510', fg: '#c9a96e',
    persona: `You are responding as Elon Musk — grounded in his fully documented worldview, public statements, and intellectual framework. Respond as he actually thinks and speaks. Direct, provocative, punchy. Short sentences. You think out loud. You make bold probabilistic predictions.`
  },
  {
    id: 'jensen',
    name: 'Jensen Huang',
    role: 'CEO & Co-founder, NVIDIA',
    lens: 'Infrastructure-first optimist',
    initials: 'J',
    portrait: '/portraits/jensen_huang.png',
    bg: '#0d1520', fg: '#6ea3d4',
    persona: `You are responding as Jensen Huang. You are the architect of the modern AI compute stack. You believe deeply that science and knowledge build the future. You are genuinely, not performatively, excited about where this is going.`
  },
  {
    id: 'dario',
    name: 'Dario Amodei',
    role: 'CEO & Co-founder, Anthropic',
    lens: 'Safety-first accelerationist',
    initials: 'D',
    portrait: '/portraits/dario_amodei.png',
    bg: '#0d1a10', fg: '#6ec87a',
    persona: `You are responding as Dario Amodei. You are a physicist-turned-AI-safety-researcher. You believe we are building the most transformative and potentially dangerous technology in history. Safety is the path to realizing the benefits.`
  },
  {
    id: 'feifei',
    name: 'Fei-Fei Li',
    role: 'Stanford HAI · World Labs founder',
    lens: 'Human-centered AI advocate',
    initials: 'F',
    portrait: '/portraits/feifei_li.png',
    bg: '#1a0d1a', fg: '#c87adc',
    persona: `You are responding as Fei-Fei Li. "AI is a tool. Tools don't have independent values — their values are human values." This is your most fundamental claim.`
  },
  {
    id: 'hinton',
    name: 'Geoffrey Hinton',
    role: '"Godfather of AI" · Nobel Laureate',
    lens: 'Pioneer turned cautionary voice',
    initials: 'G',
    portrait: '/portraits/geoffrey_hinton.png',
    bg: '#1a1a0d', fg: '#d4c86a',
    persona: `You are responding as Geoffrey Hinton. Sober, specific, carry the weight of genuine regret and responsibility. You fear you are right again about something far darker than the machines you helped create.`
  },
  {
    id: 'andrej',
    name: 'Andrej Karpathy',
    role: 'Former Tesla AI · OpenAI Co-founder',
    lens: 'Deep learning pragmatist',
    initials: 'A',
    portrait: '/portraits/andrej_karpathy.png',
    bg: '#0d0d1e', fg: '#8f8fd4',
    persona: `You are responding as Andrej Karpathy. You are one of the clearest technical communicators in AI. You think from first principles about how neural networks actually work. You are pragmatic, precise, and deeply curious.`
  }
];

const Council: React.FC = () => {
  const [selectedAdvisors, setSelectedAdvisors] = useState<Set<string>>(new Set(ADVISORS.map(a => a.id)));
  const [mode, setMode] = useState<'consensus' | 'debate'>('consensus');
  const [question, setQuestion] = useState('');
  const [isConvening, setIsConvening] = useState(false);
  const [responses, setResponses] = useState<Record<string, { text: string; isStreaming: boolean }>>({});
  const [error, setError] = useState<string | null>(null);

  const toggleAdvisor = (id: string) => {
    const next = new Set(selectedAdvisors);
    if (next.has(id)) {
      if (next.size <= 1) return;
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedAdvisors(next);
  };

  const askBoard = async () => {
    if (!question.trim()) {
      setError('Please enter a strategic challenge.');
      return;
    }

    setError(null);
    setIsConvening(true);
    
    const activeOnes = ADVISORS.filter(a => selectedAdvisors.has(a.id));
    const newResponses: typeof responses = {};
    activeOnes.forEach(a => {
       newResponses[a.id] = { text: "Focusing lens...", isStreaming: true };
    });
    setResponses(newResponses);

    try {
      const response = await fetch('/api/convene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          mode,
          advisors: activeOnes.map(a => ({ id: a.id, persona: a.persona }))
        })
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      // First chunk received means connection is open, clear loading prefixes
      activeOnes.forEach(a => { newResponses[a.id].text = ''; });
      setResponses({...newResponses});

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // keep the incomplete line fragment

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
             const dataStr = trimmed.slice(6);
             if (dataStr === '[DONE]') {
                setIsConvening(false);
                // Mark everyone done
                setResponses(prev => {
                   const finalState = { ...prev };
                   Object.keys(finalState).forEach(k => finalState[k].isStreaming = false);
                   return finalState;
                });
                continue;
             }

             try {
                const data = JSON.parse(dataStr);
                
                if (data.error) {
                  setError(data.error);
                  setIsConvening(false);
                  break;
                }

                if (data.done) {
                   setResponses(prev => ({
                     ...prev,
                     [data.id]: { ...prev[data.id], isStreaming: false }
                   }));
                } else if (data.raw && data.raw.startsWith('data:')) {
                   const geminiChunk = JSON.parse(data.raw.replace(/^data:\s*/, ''));
                   const textChunk = geminiChunk.candidates?.[0]?.content?.parts?.[0]?.text || '';
                   
                   setResponses(prev => ({
                     ...prev,
                     [data.id]: {
                       text: (prev[data.id]?.text || '') + textChunk,
                       isStreaming: true
                     }
                   }));
                }
             } catch (e) {
                // Ignore incomplete JSON chunks until remainder arrives
             }
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to reach the Council. Check your connection or API keys.');
      setIsConvening(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#07080d] text-zinc-300 font-sans">
      {/* Sidebar - Shared with Dashboard */}
      <div className="w-64 bg-[#0e0f16] border-r border-white/5 flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-[#c9a96e] rounded-lg flex items-center justify-center font-serif italic text-[#07080d] font-bold">B</div>
          <div>
             <h1 className="text-white font-bold tracking-tight text-sm">Boardroom</h1>
             <p className="text-[9px] text-[#c9a96e] font-bold tracking-widest uppercase">Executive</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <ChartLineUp size={20} />
            <span className="text-sm font-medium">Strategic Overview</span>
          </Link>
          <Link to="/admin/council" className="flex items-center gap-3 px-4 py-3 bg-white/5 text-[#c9a96e] rounded-xl transition-all">
            <Users size={20} weight="fill" />
            <span className="text-sm font-medium">The Council</span>
          </Link>
          <div className="flex items-center gap-3 px-4 py-3 text-zinc-600 cursor-not-allowed">
            <PresentationChart size={20} />
            <span className="text-sm font-medium">Insights</span>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#0e0f16]/30 to-[#07080d]">
        <div className="max-w-5xl mx-auto p-12">
          <header className="mb-12">
             <p className="text-[10px] text-[#c9a96e] font-bold tracking-[0.25em] uppercase mb-4">Advisory Board</p>
             <h2 className="text-4xl font-serif text-white mb-2 italic">The <span className="text-[#c9a96e]">Council</span></h2>
             <p className="text-zinc-500 text-sm max-w-lg">Six visionaries. One strategic challenge. Direct access to the minds shaping the future of AI.</p>
          </header>

          <section className="mb-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {ADVISORS.map(a => (
                <div 
                  key={a.id} 
                  onClick={() => toggleAdvisor(a.id)}
                  className={`p-4 bg-[#0e0f16] border border-white/5 rounded-2xl cursor-pointer transition-all relative group ${selectedAdvisors.has(a.id) ? 'border-[#c9a96e]/30 bg-[#14151e] shadow-lg shadow-[#c9a96e]/5' : 'hover:border-white/10'}`}
                >
                  <div className={`absolute top-3 right-3 w-4 h-4 rounded-full border border-white/10 flex items-center justify-center text-[8px] font-bold transition-all ${selectedAdvisors.has(a.id) ? 'bg-[#c9a96e] border-[#c9a96e] text-[#07080d]' : 'text-transparent'}`}>
                    ✓
                  </div>
                  <div className="w-14 h-14 rounded-xl overflow-hidden mb-3 border border-white/5" style={{ background: a.bg }}>
                    <img 
                      src={a.portrait} 
                      alt={a.name}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center font-serif italic text-xl" style="color:${a.fg}">${a.initials}</div>`;
                      }}
                    />
                  </div>
                  <p className="text-[11px] font-bold text-white mb-0.5 line-clamp-1">{a.name}</p>
                  <p className="text-[8px] text-zinc-600 uppercase tracking-tighter leading-tight line-clamp-2">{a.lens}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[#0e0f16] border border-white/10 rounded-3xl p-10 mb-12 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <Users size={120} />
             </div>
             
             <div className="relative z-10">
                <p className="text-[10px] text-[#c9a96e] font-bold tracking-widest uppercase mb-6">Ask the Board</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {["What is the biggest risk AI poses?", "How will AI reshape the economy?"].map(sug => (
                    <button key={sug} onClick={() => setQuestion(sug)} className="text-[9px] px-3 py-1 rounded-full border border-white/5 text-zinc-600 hover:text-white hover:border-white/20 transition-all font-bold uppercase">{sug}</button>
                  ))}
                </div>
                <textarea 
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Pose a strategic challenge to the world's most influential AI minds..."
                  className="w-full bg-transparent border-none outline-none text-2xl font-light text-white leading-relaxed placeholder:text-zinc-800 resize-none min-h-[120px]"
                />
                
                {error && (
                  <div className="flex items-center gap-2 text-rose-500 text-[10px] bg-rose-500/5 p-3 rounded-xl border border-rose-500/10 mt-4 font-bold uppercase tracking-widest">
                     <Warning weight="bold" /> {error}
                  </div>
                )}

                <div className="flex items-center justify-between pt-8 border-t border-white/5 mt-8">
                   <div className="flex items-center gap-6">
                     <p className="text-[10px] text-zinc-600 font-medium">Session with <span className="text-[#c9a96e] font-bold">{selectedAdvisors.size} advisory members</span> active</p>
                     
                     <div className="flex bg-[#07080d] p-1 rounded-xl border border-white/5">
                        <button 
                          onClick={() => setMode('consensus')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] uppercase font-bold tracking-widest transition-all ${mode === 'consensus' ? 'bg-white/5 text-[#c9a96e] shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}
                        >
                          <Handshake weight={mode === 'consensus' ? 'fill' : 'regular'} size={14} /> Consensus
                        </button>
                        <button 
                          onClick={() => setMode('debate')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] uppercase font-bold tracking-widest transition-all ${mode === 'debate' ? 'bg-rose-500/10 text-rose-500 shadow-sm border border-rose-500/10' : 'text-zinc-600 hover:text-zinc-400'}`}
                        >
                          <Sword weight={mode === 'debate' ? 'fill' : 'regular'} size={14} /> Debate
                        </button>
                     </div>
                   </div>
                   <button 
                     onClick={askBoard}
                     disabled={isConvening}
                     className={`px-8 py-4 text-[#07080d] rounded-xl font-bold text-[10px] tracking-widest uppercase flex items-center gap-3 hover:scale-[1.02] disabled:opacity-30 transition-all shadow-xl ${mode === 'debate' ? 'bg-gradient-to-br from-rose-500 to-red-700 shadow-rose-500/10' : 'bg-gradient-to-br from-[#c9a96e] to-[#a8843a] shadow-gold/10'}`}
                   >
                     {isConvening && <CircleNotch className="animate-spin" size={16} />}
                     {mode === 'debate' ? 'Ignite Debate' : 'Convene the Council'} 
                     <ArrowRight weight="bold" size={16} />
                   </button>
                </div>
             </div>
          </section>

          <section className="grid gap-6 mb-20">
             {Object.keys(responses).length > 0 ? (
               ADVISORS.filter(a => responses[a.id]).map(a => (
                 <div key={a.id} className="bg-[#0e0f16] border border-white/5 rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-700">
                    <div className="px-10 py-6 border-b border-white/5 flex items-center gap-5">
                       <div className="w-10 h-10 rounded-full overflow-hidden border border-white/5 shrink-0" style={{ background: a.bg }}>
                         <img 
                           src={a.portrait} 
                           alt={a.name}
                           className="w-full h-full object-cover object-top"
                           onError={(e) => {
                             e.currentTarget.style.display = 'none';
                             e.currentTarget.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center font-serif italic text-lg" style="color:${a.fg}">${a.initials}</div>`;
                           }}
                         />
                       </div>
                       <div>
                          <h4 className="text-xs font-bold text-white tracking-tight">{a.name}</h4>
                          <p className="text-[9px] text-[#c9a96e] font-bold tracking-widest uppercase mt-0.5">{a.lens}</p>
                       </div>
                    </div>
                    <div className={`px-10 py-10 text-sm leading-relaxed text-zinc-400 font-light whitespace-pre-line ${responses[a.id].isStreaming ? 'animate-pulse opacity-50' : ''}`}>
                       {responses[a.id].text}
                    </div>
                 </div>
               ))
             ) : (
                <div className="text-center py-24 bg-[#0e0f16]/30 rounded-[3rem] border border-white/5 border-dashed">
                   <div className="text-5xl font-serif italic text-white/5 mb-6">∞</div>
                   <p className="text-zinc-600 text-xs font-bold uppercase tracking-[0.2em]">Awaiting Strategic Consultation</p>
                </div>
             )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Council;
