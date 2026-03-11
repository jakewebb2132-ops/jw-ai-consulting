import React, { useState } from 'react';
import { useProposalStore } from '../../store/proposalStore';
import { CloudCheck, FilePdf, LinkSimple, CircleNotch, Database } from 'phosphor-react';

const TopNav: React.FC = () => {
  const { proposal, updateProposalDetails, saveProposal, isSaving, saveError } = useProposalStore();
  const [isExporting, setIsExporting] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateProposalDetails({ title: e.target.value });
  };

  const handleExportPDF = async () => {
    if (!proposal) return;
    
    setIsExporting(true);
    
    try {
      // Build the full URL to the hidden print route
      // In production, this would be your actual domain!
      const currentOrigin = window.location.origin;
      const targetUrl = `${currentOrigin}/proposal-generator/print`; // Could append ?id=${proposal.id}

      const response = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: targetUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${proposal.title || 'Proposal'}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
    } catch (error) {
      console.error('Export PDF error:', error);
      alert('There was an error generating the PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <header className="h-16 w-full flex items-center justify-between px-6 border-b border-blue-100 bg-white/70 backdrop-blur-xl shadow-sm shrink-0 z-10 relative">
      {/* Left: Branding & Title */}
      <div className="flex items-center gap-4">
        <div className="font-bold text-lg tracking-tight">JW AI</div>
        <div className="h-6 w-px bg-zinc-300 rounded-full" />
        <input
          type="text"
          value={proposal?.title || 'Untitled Proposal'}
          onChange={handleTitleChange}
          placeholder="Enter proposal title..."
          className="text-lg font-semibold bg-transparent border-none outline-none focus:ring-0 placeholder:text-zinc-400 w-64"
        />
      </div>

      {/* Center: Status Indicator */}
      <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium">
        <CloudCheck weight="fill" className="text-zinc-400" size={18} />
        {proposal ? `Saved as ${proposal.status.toLowerCase()}` : 'Draft'}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {saveError && <span className="text-red-500 text-xs font-medium mr-2 max-w-[150px] truncate">{saveError}</span>}
        <button 
          onClick={() => saveProposal()}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? <CircleNotch weight="bold" className="animate-spin" /> : <Database weight="bold" />}
          {isSaving ? 'Saving...' : 'Save to DB'}
        </button>
        <button className="px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-md transition-colors">
          Preview
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors">
          <LinkSimple weight="bold" />
          Share Link
        </button>
        <button 
          onClick={handleExportPDF}
          disabled={isExporting}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md transition-all shadow-sm ${
            isExporting ? 'bg-zinc-700 cursor-not-allowed' : 'bg-zinc-900 hover:bg-black'
          }`}
        >
          {isExporting ? (
            <>
              <CircleNotch weight="bold" className="animate-spin" />
              Generating...
            </>
          ) : (
             <>
              <FilePdf weight="fill" />
              Export PDF
             </>
          )}
        </button>
      </div>
    </header>
  );
};

export default TopNav;
