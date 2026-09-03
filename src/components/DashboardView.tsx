import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  FileText,
  Layers,
  Calendar,
  Eye,
  Trash2,
  Copy,
  Printer,
  Download,
  Upload,
  ArrowUpDown,
  Building2,
  SlidersHorizontal,
  FileSpreadsheet,
  Check,
  Sparkles
} from 'lucide-react';
import { Quotation } from '../types';
import { InterglassEmblem } from './InterglassLogo';
import { calculateQuotationTotals } from '../utils/calculations';
import { generateNextQuoteNumber } from '../utils/quotationStorage';

interface DashboardViewProps {
  quotations: Quotation[];
  onAddNewQuotation: () => void;
  onOpenQuotation: (quotation: Quotation, tab?: 'edit' | 'preview') => void;
  onDuplicateQuotation: (id: string) => void;
  onDeleteQuotation: (id: string) => void;
  onLoadSample: () => void;
  onExportBackup: () => void;
  onImportBackup: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  quotations,
  onAddNewQuotation,
  onOpenQuotation,
  onDuplicateQuotation,
  onDeleteQuotation,
  onLoadSample,
  onExportBackup,
  onImportBackup,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'ref-desc'>('date-desc');
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  // Compute next quote number for display on the Add button
  const nextQuoteNumber = useMemo(() => {
    return generateNextQuoteNumber(new Date(), quotations);
  }, [quotations]);

  // Extract available months for filtering
  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>();
    quotations.forEach((q) => {
      const ref = q.from?.refNo || '';
      // Check if format IGC/YY/MM/...
      const parts = ref.split('/');
      if (parts.length >= 3 && parts[0] === 'IGC') {
        monthsSet.add(`${parts[1]}/${parts[2]}`);
      } else if (q.from?.dated) {
        // Fallback to dated e.g. 03-09-2026
        const dateParts = q.from.dated.split('-');
        if (dateParts.length === 3) {
          const yy = dateParts[2].slice(-2);
          const mm = dateParts[1];
          monthsSet.add(`${yy}/${mm}`);
        }
      }
    });
    return Array.from(monthsSet).sort().reverse();
  }, [quotations]);

  // Filter and sort quotations
  const filteredQuotations = useMemo(() => {
    return quotations
      .filter((q) => {
        const query = searchTerm.toLowerCase().trim();
        const refMatch = (q.from?.refNo || '').toLowerCase().includes(query);
        const clientMatch = (q.client?.name || '').toLowerCase().includes(query);
        const emirateMatch = (q.client?.emirate || '').toLowerCase().includes(query);
        const attnMatch = (q.client?.kindAttn || '').toLowerCase().includes(query);
        const titleMatch = (q.title || '').toLowerCase().includes(query);

        const matchesSearch = !query || refMatch || clientMatch || emirateMatch || attnMatch || titleMatch;

        if (!matchesSearch) return false;

        if (selectedMonth !== 'all') {
          const ref = q.from?.refNo || '';
          const hasMonth = ref.includes(`/${selectedMonth}/`);
          return hasMonth;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'amount-desc') {
          const totalA = calculateQuotationTotals(a).totalWithVatAED;
          const totalB = calculateQuotationTotals(b).totalWithVatAED;
          return totalB - totalA;
        }
        if (sortBy === 'date-asc') {
          return new Date(a.createdAt || a.updatedAt).getTime() - new Date(b.createdAt || b.updatedAt).getTime();
        }
        if (sortBy === 'ref-desc') {
          return (b.from?.refNo || '').localeCompare(a.from?.refNo || '');
        }
        // Default: date-desc (newest first)
        return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
      });
  }, [quotations, searchTerm, selectedMonth, sortBy]);

  // Calculate Overall Dashboard Metrics
  const metrics = useMemo(() => {
    let totalValue = 0;
    let totalSqm = 0;
    let totalItems = 0;

    quotations.forEach((q) => {
      const { totalWithVatAED, grandTotalSqm, grandTotalQty } = calculateQuotationTotals(q);
      totalValue += totalWithVatAED;
      totalSqm += grandTotalSqm;
      totalItems += grandTotalQty;
    });

    // Current month count (e.g. 26/09)
    const now = new Date();
    const currentYyMm = `${String(now.getFullYear()).slice(-2)}/${String(now.getMonth() + 1).padStart(2, '0')}`;
    const thisMonthCount = quotations.filter((q) => (q.from?.refNo || '').includes(`/${currentYyMm}/`)).length;

    return {
      count: quotations.length,
      totalValue,
      totalSqm,
      totalItems,
      thisMonthCount,
      currentYyMm,
    };
  }, [quotations]);

  const handleCopyRef = (refNo: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(refNo);
    setCopiedRef(refNo);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  return (
    <div className="flex-1 bg-slate-50/80 min-h-screen">
      {/* Top Banner / Hero Header */}
      <div className="bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Branding & Title */}
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl shadow-xs shrink-0 mt-0.5">
                <InterglassEmblem width={60} height={38} />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-serif italic font-black text-[#7B1818] tracking-wide">
                    INTERGLASS CO. LLC
                  </h1>
                  <span className="px-2 py-0.5 text-xs font-semibold bg-red-50 text-[#7B1818] border border-red-200/80 rounded-md uppercase tracking-wider">
                    Quotations Portal
                  </span>
                </div>
                <p className="text-slate-600 text-sm mt-1">
                  Manage, track, and generate official glass supply quotations with sequential ref numbers
                </p>
              </div>
            </div>

            {/* Primary Action: Add New Quotation Button */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={onAddNewQuotation}
                id="btn-add-new-quotation"
                className="px-5 py-2.5 bg-[#7B1818] hover:bg-[#631313] text-white rounded-lg shadow-sm hover:shadow-md font-medium text-sm flex items-center gap-2.5 transition-all transform active:scale-98 cursor-pointer"
              >
                <Plus className="w-5 h-5 text-white/90" />
                <span className="font-semibold">Add New Quotation</span>
                <span className="hidden sm:inline-block text-[11px] bg-white/20 px-2 py-0.5 rounded text-white/90 font-mono">
                  {nextQuoteNumber}
                </span>
              </button>

              <label className="cursor-pointer px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Import JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={onImportBackup}
                  className="hidden"
                />
              </label>

              {quotations.length > 0 && (
                <button
                  type="button"
                  onClick={onExportBackup}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Download full JSON backup of all quotations"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Backup All</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Quotations</span>
                <FileText className="w-4 h-4 text-slate-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">{metrics.count}</span>
                <span className="text-xs text-slate-500 font-medium">records</span>
              </div>
              <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
                <span>Next Quote:</span>
                <span className="font-mono font-bold text-[#7B1818]">{nextQuoteNumber}</span>
              </div>
            </div>

            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Pipeline Value</span>
                <span className="text-xs font-mono font-bold text-slate-400">AED</span>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-slate-900 font-mono">
                  {metrics.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Incl. 5% UAE VAT
              </div>
            </div>

            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Glass Area</span>
                <Layers className="w-4 h-4 text-slate-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-slate-900 font-mono">
                  {metrics.totalSqm.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-slate-500 font-medium">m²</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-mono">
                {metrics.totalItems} pieces ordered
              </div>
            </div>

            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">This Month</span>
                <Calendar className="w-4 h-4 text-slate-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#7B1818]">{metrics.thisMonthCount}</span>
                <span className="text-xs text-slate-500 font-medium">in {metrics.currentYyMm}</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Serial count in current cycle
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Search, Filters & Quotations Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Controls Bar: Search & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by quote number (e.g. IGC/26/09), client, emirate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7B1818]/20 focus:border-[#7B1818] transition-all shadow-2xs"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Month Filter */}
            {availableMonths.length > 0 && (
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs text-xs text-slate-600">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  aria-label="Filter by month"
                  className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Months</option>
                  {availableMonths.map((m) => (
                    <option key={m} value={m}>
                      Month {m}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs text-xs text-slate-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort quotations"
                className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="ref-desc">Quote Ref (Z-A)</option>
              </select>
            </div>

            {/* Sample Loader Shortcut */}
            <button
              type="button"
              onClick={onLoadSample}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-[#7B1818] bg-white border border-slate-200 hover:border-red-200 rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Add Thamvos Interiors sample quotation template"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Load Sample</span>
            </button>
          </div>
        </div>

        {/* Quotations List / Table Container */}
        {filteredQuotations.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12 text-center shadow-2xs">
            <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#7B1818]">
              <FileText className="w-8 h-8" />
            </div>
            {searchTerm || selectedMonth !== 'all' ? (
              <>
                <h3 className="text-base font-semibold text-slate-800">No matching quotations found</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                  No quotes found for your active filter criteria. Try clearing search filters or checking other months.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedMonth('all');
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-serif italic font-bold text-slate-900">
                  Welcome to Interglass Quotations Portal
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-md mx-auto">
                  No quotations created yet. Click the button below to start your first quote with auto-generated serial number <span className="font-mono font-bold text-[#7B1818]">{nextQuoteNumber}</span>.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={onAddNewQuotation}
                    className="px-5 py-2.5 bg-[#7B1818] hover:bg-[#631313] text-white rounded-lg shadow-sm font-medium text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Quotation ({nextQuoteNumber})</span>
                  </button>
                  <button
                    type="button"
                    onClick={onLoadSample}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-slate-600" />
                    <span>Load Thamvos Template</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          /* Table View of Saved Quotations */
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    <th className="py-3 px-4 w-44">Quote Number</th>
                    <th className="py-3 px-3 w-28">Date</th>
                    <th className="py-3 px-4">Client & Details</th>
                    <th className="py-3 px-3 text-center w-28">Glass Specs</th>
                    <th className="py-3 px-4 text-right w-36">Total (AED)</th>
                    <th className="py-3 px-4 text-right w-48">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredQuotations.map((q) => {
                    const { grandTotalQty, grandTotalSqm, totalWithVatAED } = calculateQuotationTotals(q);
                    const ref = q.from?.refNo || 'Pending Ref';
                    const isCopied = copiedRef === ref;

                    return (
                      <tr
                        key={q.id}
                        onClick={() => onOpenQuotation(q, 'edit')}
                        className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                      >
                        {/* Quote Number Badge */}
                        <td className="py-3 px-4 align-top">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-[#7B1818] text-xs sm:text-sm bg-red-50/80 px-2 py-0.5 rounded border border-red-200/60 group-hover:border-red-300 transition-colors">
                              {ref}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleCopyRef(ref, e)}
                              className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors"
                              title="Copy quote number"
                            >
                              {isCopied ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-1">
                            {q.from?.rev || 'REV-00'}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="py-3 px-3 align-top text-slate-600 font-mono text-xs">
                          {q.from?.dated || new Date(q.createdAt).toLocaleDateString('en-GB')}
                        </td>

                        {/* Client & Info */}
                        <td className="py-3 px-4 align-top">
                          <div className="font-semibold text-slate-900 text-sm">
                            {q.client?.name || <span className="text-slate-400 italic">No client name entered</span>}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap">
                            {q.client?.emirate && (
                              <span className="inline-flex items-center gap-1 text-[11px] bg-slate-100 px-1.5 py-0.2 rounded font-medium text-slate-600">
                                <Building2 className="w-3 h-3 text-slate-400" />
                                {q.client.emirate}
                              </span>
                            )}
                            {q.client?.kindAttn && (
                              <span className="text-[11px] text-slate-500">
                                Attn: <span className="text-slate-700 font-medium">{q.client.kindAttn}</span>
                              </span>
                            )}
                            {q.paymentTerms && (
                              <span className="text-[10px] uppercase font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                                {q.paymentTerms}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Glass Specs */}
                        <td className="py-3 px-3 align-top text-center">
                          <div className="font-mono text-xs font-semibold text-slate-700">
                            {grandTotalSqm.toFixed(2)} m²
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {q.glassSections?.length || 0} Sec • {grandTotalQty} Pcs
                          </div>
                        </td>

                        {/* Total Amount AED */}
                        <td className="py-3 px-4 align-top text-right">
                          <div className="font-mono font-bold text-sm text-slate-900">
                            AED {totalWithVatAED.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Incl. 5% VAT
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 align-top text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Open / Edit Button */}
                            <button
                              type="button"
                              onClick={() => onOpenQuotation(q, 'edit')}
                              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                              title="Open & Edit quotation"
                            >
                              <span>Open</span>
                            </button>

                            {/* Preview / Print Button */}
                            <button
                              type="button"
                              onClick={() => onOpenQuotation(q, 'preview')}
                              className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                              title="Print & View quotation document"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>

                            {/* Duplicate Button */}
                            <button
                              type="button"
                              onClick={() => onDuplicateQuotation(q.id)}
                              className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                              title="Duplicate with next serial number"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => onDeleteQuotation(q.id)}
                              className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                              title="Delete quotation"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer Summary in Table */}
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
              <div>
                Showing <span className="font-semibold text-slate-700">{filteredQuotations.length}</span> of{' '}
                <span className="font-semibold text-slate-700">{quotations.length}</span> total quotations
              </div>
              <div className="flex items-center gap-3">
                <span>
                  Next quote sequence: <strong className="font-mono text-[#7B1818]">{nextQuoteNumber}</strong>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
