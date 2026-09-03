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
  Loader2,
  ArrowLeft,
  LayoutDashboard,
  Save
} from 'lucide-react';
import { InterglassEmblem } from './InterglassLogo';

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
  onBackToDashboard: () => void;
  onSaveCurrentQuote?: () => void;
  glassSectionCount: number;
  currentRefNo?: string;
  clientName?: string;
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
  onBackToDashboard,
  onSaveCurrentQuote,
  glassSectionCount,
  currentRefNo,
  clientName,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm print:hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Dashboard return & Branding */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Back to Dashboard Button */}
          <button
            type="button"
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-[#7B1818] bg-slate-100 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg transition-colors cursor-pointer"
            title="Return to Quotations Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden md:inline">Dashboard</span>
          </button>

          <div className="h-6 w-[1px] bg-slate-200 hidden md:block"></div>

          <div className="p-1 bg-slate-50 border border-slate-200 rounded-lg hidden sm:flex items-center justify-center shrink-0">
            <InterglassEmblem width={38} height={24} />
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {currentRefNo ? (
                <span className="font-mono font-bold text-xs sm:text-sm text-[#7B1818] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  {currentRefNo}
                </span>
              ) : (
                <h1 className="text-sm font-bold text-slate-900 leading-tight">
                  Interglass
                </h1>
              )}
              {clientName && (
                <span className="text-xs text-slate-600 truncate max-w-[120px] sm:max-w-[180px] font-medium hidden sm:inline-block">
                  • {clientName}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold hidden sm:block">
              Inter Glass Co. LLC • Quotation Portal
            </p>
          </div>
        </div>

        {/* Center: Mode Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
              activeTab === 'edit'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Form & </span><span>Builder</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Document </span><span>Preview</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Save button */}
          {onSaveCurrentQuote && (
            <button
              type="button"
              onClick={onSaveCurrentQuote}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition cursor-pointer"
              title="Save changes to Dashboard"
            >
              <Save className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Save</span>
            </button>
          )}

          {/* Add Glass Section (+) */}
          <button
            type="button"
            onClick={onAddGlassSection}
            className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md shadow-xs transition cursor-pointer"
            title="Add a new glass type section (Glass -02, Glass -03...)"
          >
            <Plus className="w-3.5 h-3.5 text-blue-600" />
            <span>Add Glass Type ({glassSectionCount + 1})</span>
          </button>

          {/* PRINT BUTTON */}
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
            title="Print Quotation according to template"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* SAVE AS PDF BUTTON */}
          <button
            type="button"
            onClick={onSavePdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 bg-[#7B1818] hover:bg-[#631313] text-white rounded-md text-xs font-medium shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            title="Download PDF to your computer"
          >
            {isGeneratingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
            ) : (
              <FileDown className="w-3.5 h-3.5 text-white" />
            )}
            <span>PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
