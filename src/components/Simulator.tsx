import { useState } from 'react'
import { Zap, Loader2, CheckCircle2, UserPlus, Fingerprint } from 'lucide-react'
import { supabase } from '../lib/supabase'

export interface Lead {
  id: string;
  visitor_id: string;
  ip_address: string;
  full_name: string;
  job_title: string;
  company_name: string;
  company_domain: string;
  linkedin_url: string;
  profile_image_url: string;
  intent_score: number;
  visit_count: number;
  last_page_viewed: string;
  last_seen: string;
}

interface SimulatorProps {
  onNewLead?: (lead: Lead) => void;
}

export const Simulator = ({ onNewLead }: SimulatorProps) => {
  const [status, setStatus] = useState<'idle' | 'detecting' | 'resolving' | 'completed'>('idle')
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 5))

  const simulateVisitor = async () => {
    setStatus('detecting')
    addLog('New visitor detected: 192.168.1.45')
    
    await new Promise(r => setTimeout(r, 1500))
    setStatus('resolving')
    addLog('Resolving digital fingerprint...')
    addLog('Matched with professional profile...')
    
    await new Promise(r => setTimeout(r, 2000))

    const mockLead: Lead = {
      id: `sim-${Date.now()}`,
      visitor_id: `sim-${Date.now()}`,
      ip_address: '192.168.1.45',
      full_name: 'Sarah Jenkins',
      job_title: 'Head of Growth',
      company_name: 'TechFlow Systems',
      company_domain: 'techflow.io',
      linkedin_url: 'https://linkedin.com/in/sarahjenkins-mock',
      profile_image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      intent_score: 88,
      visit_count: 1,
      last_page_viewed: '/pricing',
      last_seen: new Date().toISOString()
    }

    try {
      const { error } = await supabase
        .from('visitor_leads')
        .insert([mockLead])

      if (error) {
         console.warn('Supabase insert failed, using mock fallback for demo:', error)
      }
      
      // Always pass the lead to the callback to ensure it appears in the UI
      if (onNewLead) onNewLead(mockLead)
      
      setStatus('completed')
      addLog('Lead resolved and captured.')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (err) {
      console.warn('Simulation fallback due to caught error:', err)
      if (onNewLead) onNewLead(mockLead)
      setStatus('completed')
      addLog('Lead resolved (Local display).')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="glass-card p-6 w-80 shadow-2xl border-blue-100/50 bg-white/80 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="text-blue-600 w-5 h-5 fill-blue-600" />
            <h3 className="font-bold text-slate-800 text-sm italic">De-anonymization Simulator</h3>
          </div>
          {status !== 'idle' && (
             <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
          )}
        </div>

        <div className="space-y-3 mb-6 min-h-[100px]">
          {logs.length === 0 ? (
            <div className="text-xs text-slate-400 italic text-center py-8 border-2 border-dashed border-slate-100 rounded-xl">
              Ready to capture traffic...
            </div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className={`text-xs font-medium flex items-center gap-2 ${i === 0 ? 'text-blue-600 animate-pulse' : 'text-slate-500 opacity-60'}`}>
                {i === 0 ? <Fingerprint size={12} /> : <div className="w-1 h-1 bg-slate-300 rounded-full" />}
                {log}
              </div>
            ))
          )}
        </div>

        <button 
          onClick={simulateVisitor}
          disabled={status !== 'idle'}
          className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs transition-all ${
            status === 'idle' 
              ? 'bg-slate-900 text-white hover:bg-blue-600 shadow-lg shadow-blue-600/10' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          {status === 'idle' && <UserPlus size={16} />}
          {status === 'detecting' && 'Capturing IP...'}
          {status === 'resolving' && 'Resolving Profile...'}
          {status === 'completed' && <CheckCircle2 size={16} className="text-green-500" />}
          {status === 'completed' ? 'Lead Captured' : status === 'idle' ? 'Simulate New Visitor' : 'Working...'}
        </button>
      </div>
    </div>
  )
}
