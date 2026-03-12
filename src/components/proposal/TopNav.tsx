import React, { useState, useEffect } from 'react';
import { useProposalStore } from '../../store/proposalStore';
import { FilePdf, LinkSimple, CircleNotch, Database, FloppyDisk, Check, Warning, SquaresFour } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';

const TopNav: React.FC = () => {
  const navigate = useNavigate();
  const { proposal, updateProposalDetails, saveProposal, isSaving, saveError, lastLocalSave } = useProposalStore();
  const [isExporting, setIsExporting] = useState(false);
  const [saveAge, setSaveAge] = useState<string>('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [dbSaved, setDbSaved] = useState(false);

  useEffect(() => {
    const formatAge = () => {
      if (!lastLocalSave) return;
      const diffMs = Date.now() - new Date(lastLocalSave).getTime();
      const diffSec = Math.floor(diffMs / 1000);
      if (diffSec < 60) setSaveAge('just now');
      else if (diffSec < 3600) setSaveAge(`${Math.floor(diffSec / 60)}m ago`);
      else setSaveAge(`${Math.floor(diffSec / 3600)}h ago`);
    };
    formatAge();
    const interval = setInterval(formatAge, 30_000);
    return () => clearInterval(interval);
  }, [lastLocalSave]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateProposalDetails({ title: e.target.value });
  };

  const handleExportPDF = () => {
    if (!proposal) return;
    setIsExporting(true);
    // Open the hidden print route in a new tab — the browser's native print-to-PDF dialog appears.
    const printWindow = window.open('/proposal-generator/print', '_blank');
    // Give the tab a moment to load & auto-print before resetting the button state
    setTimeout(() => setIsExporting(false), 2000);
    if (!printWindow) {
      alert('Please allow pop-ups for this site to export PDF.');
      setIsExporting(false);
    }
  };

  const handleShareLink = async () => {
    if (!proposal) return;
    // If the proposal has been saved to DB, share the magic link.
    // Otherwise, tell the user to save to DB first.
    const shareUrl = `${window.location.origin}/p/${proposal.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    } catch {
      // Fallback for browsers that block clipboard without https
      prompt('Copy this share link:', shareUrl);
    }
  };

  const handleSaveToDB = async () => {
    await saveProposal();
    if (!saveError) {
      setDbSaved(true);
      setTimeout(() => setDbSaved(false), 2500);
    }
  };

  return (
    <header className="h-16 w-full flex items-center justify-between px-6 border-b border-blue-100 bg-white/70 backdrop-blur-xl shadow-sm shrink-0 z-10 relative">
      {/* Left: Branding & Title */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center justify-center p-2 rounded-lg hover:bg-zinc-100 text-zinc-600 transition-colors group"
          title="Back to Dashboard"
        >
          <SquaresFour weight="fill" size={20} className="group-hover:text-blue-600 transition-colors" />
        </button>
        <div className="h-6 w-px bg-zinc-200" />
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

      {/* Center: Auto-Save Status Indicator */}
      <div className="flex items-center gap-2 text-sm font-medium">
        {lastLocalSave ? (
          <>
            <FloppyDisk weight="fill" className="text-emerald-500" size={16} />
            <span className="text-emerald-600">Draft auto-saved {saveAge}</span>
          </>
        ) : (
          <>
            <FloppyDisk weight="fill" className="text-zinc-300" size={16} />
            <span className="text-zinc-400">Not yet saved</span>
          </>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {saveError && (
          <span className="flex items-center gap-1 text-red-500 text-xs font-medium mr-2 max-w-[200px]">
            <Warning weight="fill" size={14} />
            {saveError}
          </span>
        )}

        {/* Save to DB */}
        <button
          onClick={handleSaveToDB}
          disabled={isSaving}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            dbSaved
              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
              : 'text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200'
          }`}
        >
          {isSaving ? <CircleNotch weight="bold" className="animate-spin" size={14} /> : dbSaved ? <Check weight="bold" size={14} /> : <Database weight="bold" size={14} />}
          {isSaving ? 'Saving...' : dbSaved ? 'Saved!' : 'Save to DB'}
        </button>

        {/* Share Link */}
        <button
          onClick={handleShareLink}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
            linkCopied
              ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
              : 'text-zinc-700 bg-zinc-100 hover:bg-zinc-200 border border-transparent'
          }`}
        >
          {linkCopied ? <Check weight="bold" size={14} /> : <LinkSimple weight="bold" size={14} />}
          {linkCopied ? 'Link Copied!' : 'Share Link'}
        </button>

        {/* Export PDF */}
        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md transition-all shadow-sm ${
            isExporting ? 'bg-zinc-700 cursor-not-allowed' : 'bg-zinc-900 hover:bg-black'
          }`}
        >
          {isExporting ? (
            <>
              <CircleNotch weight="bold" className="animate-spin" size={14} />
              Opening...
            </>
          ) : (
            <>
              <FilePdf weight="fill" size={14} />
              Export PDF
            </>
          )}
        </button>
      </div>
    </header>
  );
};

export default TopNav;
