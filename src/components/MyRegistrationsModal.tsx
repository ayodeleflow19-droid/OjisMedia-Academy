import React, { useState, useEffect } from 'react';
import { StudentEnrollment } from '../types';
import { api } from '../lib/api';
import { 
  X, 
  Search, 
  ClipboardCheck, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Database
} from 'lucide-react';

interface MyRegistrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewEnrollment: () => void;
}

export const MyRegistrationsModal: React.FC<MyRegistrationsModalProps> = ({
  isOpen,
  onClose,
  onNewEnrollment
}) => {
  const [enrollments, setEnrollments] = useState<StudentEnrollment[]>([]);
  const [searchRef, setSearchRef] = useState('');
  const [searchResult, setSearchResult] = useState<StudentEnrollment | null>(null);
  const [searched, setSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      try {
        const stored = localStorage.getItem('ojis_media_enrollments');
        if (stored) {
          setEnrollments(JSON.parse(stored));
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchRef.trim()) return;

    setIsSearching(true);
    setSearched(true);
    
    // First check local cache
    let found = enrollments.find(
      item => item.referenceNumber.toLowerCase() === searchRef.trim().toLowerCase() || item.email.toLowerCase() === searchRef.trim().toLowerCase()
    );

    // If not found in local cache, query MongoDB backend
    if (!found) {
      found = (await api.lookupEnrollment(searchRef.trim())) || undefined;
    }

    setSearchResult(found || null);
    setIsSearching(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden max-h-[85vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50 sticky top-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-900">
              Check Application Status
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Reference Lookup */}
          <form onSubmit={handleSearch} className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700">
              Enter Reference Number:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. OJIS-2026-8492"
                  value={searchRef}
                  onChange={(e) => setSearchRef(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono uppercase text-slate-900 focus:outline-none focus:border-blue-900"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg text-xs cursor-pointer transition-colors"
              >
                Lookup
              </button>
            </div>
          </form>

          {/* Search Result */}
          {searched && (
            <div className="pt-2">
              {searchResult ? (
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Reference ID</span>
                      <strong className="font-mono text-sm text-blue-900">{searchResult.referenceNumber}</strong>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                      {searchResult.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Student:</span>
                      <strong className="text-slate-900">{searchResult.fullName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Track:</span>
                      <strong className="text-slate-900 truncate block">{searchResult.selectedCourseTitle}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Cohort:</span>
                      <span>{searchResult.preferredCohort}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Mode:</span>
                      <span>{searchResult.learningMode}</span>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/2348123456789?text=Hello%20OJISMediaAcademy,%20checking%20status%20for%20ID%20${searchResult.referenceNumber}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Follow Up on WhatsApp</span>
                  </a>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-600">
                  No record found matching "<strong>{searchRef}</strong>". Please check your reference code.
                </div>
              )}
            </div>
          )}

          {/* Recent Applications on Device */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-semibold text-slate-800">
              Applications Saved on This Device ({enrollments.length})
            </h4>

            {enrollments.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {enrollments.map((item) => (
                  <div 
                    key={item.id}
                    className="p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors text-xs flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-blue-900">{item.referenceNumber}</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-medium text-slate-900">{item.fullName}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{item.selectedCourseTitle} ({item.preferredCohort})</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium whitespace-nowrap">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 bg-slate-50 rounded-lg text-xs text-slate-500">
                No recent enrollments stored on this browser yet.
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
          <button
            onClick={() => {
              onClose();
              onNewEnrollment();
            }}
            className="flex items-center gap-1 text-xs font-semibold text-blue-900 hover:text-blue-800 cursor-pointer"
          >
            <span>Start new enrollment</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold cursor-pointer hover:bg-slate-800"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
