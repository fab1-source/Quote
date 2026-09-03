import React from 'react';
import {
  Printer,
  FileDown,
  Plus,
  RotateCcw,
  Sparkles,
  FolderOpen,
  Eye,
  Edit3,
  Loader2
} from 'lucide-react';
import { InterglassLogo } from './InterglassLogo';

interface TopNavbarProps {
  activeTab: 'edit' | 'preview';
  setActiveTab: (tab: 'edit' | 'preview') => void;
  isGeneratingPdf: boolean;
  onPrint: () => void;
  onSavePdf: () => void;
  onAddGlassSection: () => void;
  onLoadSample: () => void;
  onNewQuotation: () => void;
  onOpenHistory: () => void;
  glassSectionCount: number;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeTab,
  setActiveTab,
  isGeneratingPdf,
  onPrint,
  onSavePdf,
  onAddGlassSection,
  onLoadSample,
  onNewQuotation,
  onOpenHistory,
  glassSectionCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Branding & App Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-xs shrink-0">
            G
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                Interglass CrystalFlow
              </h1>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-700 rounded uppercase tracking-wider">
                Quotation Portal
              </span>
            </div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Inter Glass Co. LLC • Ajman, UAE
            </p>
          </div>
        </div>

        {/* Center: Mode Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
              activeTab === 'edit'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-600" />
            <span>Form & Builder</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>Document Preview</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Add Glass Section (+) */}
          <button
            type="button"
            onClick={onAddGlassSection}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md shadow-xs transition cursor-pointer"
            title="Add a new glass type section (Glass -02, Glass -03...)"
          >
            <Plus className="w-4 h-4 text-blue-600" />
            <span>Add Glass Type ({glassSectionCount + 1})</span>
          </button>

          {/* Load Sample / Reset Menu */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-300 rounded-md transition shadow-xs cursor-pointer"
            title="Saved Quotations"
          >
            <FolderOpen className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onLoadSample}
            className="hidden lg:inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 px-3 py-2 border border-slate-300 rounded-md transition shadow-xs cursor-pointer"
            title="Load sample template with Thamvos Interiors data"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Sample Sheet</span>
          </button>

          <button
            type="button"
            onClick={onNewQuotation}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-300 rounded-md transition shadow-xs cursor-pointer"
            title="New Blank Quotation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

          {/* PRINT BUTTON */}
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
            title="Print Quotation according to template"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Print Quote</span>
          </button>

          {/* SAVE AS PDF BUTTON */}
          <button
            type="button"
            onClick={onSavePdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            title="Download PDF to your computer"
          >
            {isGeneratingPdf ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <FileDown className="w-4 h-4 text-white" />
            )}
            <span>Save as PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
