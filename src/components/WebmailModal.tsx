import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Send, 
  Sparkles, 
  Inbox, 
  KeyRound, 
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { api } from '../lib/api';

export interface WebmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterEmail?: string;
  onActivateFromEmail?: (code: string, token?: string, email?: string) => void;
}

export const WebmailModal: React.FC<WebmailModalProps> = ({
  isOpen,
  onClose,
  filterEmail = '',
  onActivateFromEmail,
}) => {
  const [emails, setEmails] = useState<any[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchEmail, setSearchEmail] = useState(filterEmail);
  const [emailStatus, setEmailStatus] = useState<any | null>(null);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResultMsg, setTestResultMsg] = useState<string | null>(null);

  useEffect(() => {
    if (filterEmail) {
      setSearchEmail(filterEmail);
    }
  }, [filterEmail]);

  const loadEmails = async (targetEmail?: string) => {
    setIsLoading(true);
    try {
      const emailToQuery = targetEmail !== undefined ? targetEmail : searchEmail;
      const res = await api.fetchSentEmails(emailToQuery || undefined);
      if (res.success && res.emails) {
        setEmails(res.emails);
        if (res.emails.length > 0 && !selectedEmail) {
          setSelectedEmail(res.emails[0]);
        } else if (res.emails.length > 0 && selectedEmail) {
          const stillExists = res.emails.find((e: any) => e.id === selectedEmail.id);
          setSelectedEmail(stillExists || res.emails[0]);
        } else {
          setSelectedEmail(null);
        }
      }
      const statusRes = await api.getEmailServiceStatus();
      if (statusRes.success && statusRes.emailService) {
        setEmailStatus(statusRes.emailService);
      }
    } catch (e) {
      console.error('Error loading webmail:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadEmails(filterEmail);
    }
  }, [isOpen, filterEmail]);

  if (!isOpen) return null;

  const handleSendTest = async () => {
    if (!searchEmail) return;
    setIsSendingTest(true);
    setTestResultMsg(null);
    try {
      const res = await api.sendTestEmail(searchEmail);
      if (res.success) {
        setTestResultMsg(`Test activation email dispatched to ${searchEmail}!`);
        await loadEmails(searchEmail);
      } else {
        setTestResultMsg(`Dispatch note: ${res.error || 'Check configuration'}`);
      }
    } catch (err: any) {
      setTestResultMsg(`Error: ${err?.message}`);
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl h-[85vh] max-h-[750px] shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="p-4 px-6 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Academy Webmail & Activation Inbox</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Dispatch Stream
                </span>
              </div>
              <p className="text-xs text-slate-400">
                View all delivered activation letters, 6-digit codes, and confirmation emails
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => loadEmails()}
              disabled={isLoading}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh Inbox"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Top Control Filter & Status Bar */}
        <div className="bg-slate-950/60 border-b border-slate-800/80 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <span className="text-slate-400 font-medium whitespace-nowrap">Filter Inbox:</span>
            <input
              type="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Filter by email (e.g. ayodeleflow19@gmail.com)"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => loadEmails(searchEmail)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              Search
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSendTest}
              disabled={isSendingTest || !searchEmail}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-300 border border-blue-500/30 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSendingTest ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>Send Sample Activation Email</span>
            </button>
          </div>
        </div>

        {testResultMsg && (
          <div className="bg-blue-950/80 border-b border-blue-800/60 px-6 py-1.5 text-xs text-blue-200 flex items-center justify-between">
            <span>{testResultMsg}</span>
            <button onClick={() => setTestResultMsg(null)} className="text-blue-400 hover:text-white">&times;</button>
          </div>
        )}

        {/* Main Content: Email List & Email Reader */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Column: Email List */}
          <div className="w-1/3 min-w-[280px] max-w-[360px] border-r border-slate-800 flex flex-col bg-slate-950/40">
            <div className="p-3 border-b border-slate-800/60 bg-slate-900/50 flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
              <span>Messages ({emails.length})</span>
              <span className="text-[10px] text-blue-400 lowercase">{emailStatus?.provider || 'active'}</span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
              {isLoading && emails.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                  Loading inbox messages...
                </div>
              ) : emails.length === 0 ? (
                <div className="p-8 text-center text-slate-500 space-y-2">
                  <Inbox className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-xs">No emails found for this address.</p>
                  <p className="text-[11px] text-slate-600">Register or click "Send Sample Activation Email" above to trigger a live dispatch.</p>
                </div>
              ) : (
                emails.map((msg) => {
                  const isSelected = selectedEmail?.id === msg.id;
                  return (
                    <div
                      key={msg.id}
                      onClick={() => setSelectedEmail(msg)}
                      className={`p-3.5 cursor-pointer transition-colors text-left ${
                        isSelected
                          ? 'bg-blue-600/15 border-l-4 border-blue-500'
                          : 'hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-semibold text-xs text-slate-200 truncate">
                          {msg.to}
                        </span>
                        <span className="text-[10px] text-slate-500 shrink-0 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p className="text-xs text-blue-300 font-medium truncate mb-1">
                        {msg.subject}
                      </p>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/20">
                          <KeyRound className="w-3 h-3" />
                          Code: {msg.activationCode}
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase font-mono">
                          {msg.provider}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Email Content View */}
          <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
            {selectedEmail ? (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                
                {/* Email Header Bar */}
                <div className="p-4 border-b border-slate-800 bg-slate-950/80 space-y-2 shrink-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-white">{selectedEmail.subject}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
                        <div>
                          <span className="text-slate-500">From:</span>{' '}
                          <span className="text-slate-300 font-medium">{selectedEmail.from || 'OJIS Media Academy <admissions@ojismedia.academy>'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">To:</span>{' '}
                          <span className="text-blue-300 font-medium">{selectedEmail.to}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Date:</span>{' '}
                          <span className="text-slate-300">{new Date(selectedEmail.sentAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center gap-2 shrink-0">
                      {onActivateFromEmail && (
                        <button
                          onClick={() => {
                            onActivateFromEmail(selectedEmail.activationCode, selectedEmail.activationToken, selectedEmail.to);
                            onClose();
                          }}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          Activate Account Now
                        </button>
                      )}

                      {selectedEmail.etherealUrl && (
                        <a
                          href={selectedEmail.etherealUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          title="Open public Ethereal webmail page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Ethereal Tab</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* 6-digit code pill banner */}
                  <div className="p-2.5 bg-blue-950/60 border border-blue-500/30 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-300">Your Official 6-Digit Activation Code:</span>
                      <span className="font-mono font-bold text-sm bg-blue-900 px-2.5 py-0.5 rounded text-amber-300 border border-blue-400/40 tracking-wider">
                        {selectedEmail.activationCode}
                      </span>
                    </div>
                    {selectedEmail.activationUrl && (
                      <a
                        href={selectedEmail.activationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline font-semibold flex items-center gap-1"
                      >
                        Direct Activation Link &rarr;
                      </a>
                    )}
                  </div>
                </div>

                {/* HTML Email Body Container */}
                <div className="flex-1 bg-slate-950 p-4 overflow-y-auto">
                  <div className="max-w-2xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-slate-800 bg-white text-slate-900">
                    <iframe
                      srcDoc={selectedEmail.html}
                      title="Delivered Email"
                      className="w-full min-h-[500px] border-0"
                      sandbox="allow-popups allow-same-origin allow-scripts allow-top-navigation"
                    />
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
                <Mail className="w-12 h-12 mb-3 text-slate-700" />
                <h4 className="text-sm font-semibold text-slate-400">Select an email to read</h4>
                <p className="text-xs text-slate-600 max-w-sm mt-1">
                  Choose any message from the left inbox stream to preview its full graphical layout and one-click activation actions.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Footer Info on Live Real-World Inboxes */}
        <div className="p-3 px-6 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>
              Real-World Delivery: To send directly to your personal Gmail or Outlook inbox, set <code className="text-blue-300 bg-slate-900 px-1 py-0.5 rounded">GMAIL_APP_PASSWORD</code> in Settings.
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors cursor-pointer"
          >
            Close Webmail
          </button>
        </div>

      </div>
    </div>
  );
};
