// app/page.js
"use client";

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Copy, Download, Moon, Sun, 
  Lock, Check, Sparkles,
  Save, Settings, FileText
} from 'lucide-react';

export default function Home() {
  // State
  const [markdown, setMarkdown] = useState('# Welcome to Markdown Pro\n\n## Start writing...\n\n- This is a **bold** feature\n- *Italic* text support\n- `Code snippets`\n- [Links](https://example.com)\n\n```javascript\nconsole.log("Hello World!");\n```');
  const [theme, setTheme] = useState('light');
  const [license, setLicense] = useState({
    key: '',
    isValid: false
  });
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [showLicenseInput, setShowLicenseInput] = useState(false);
  const [isClient, setIsClient] = useState(false); // Track if we're on client

  const previewRef = useRef(null);

  // Fix: Use useEffect to run only on client
  useEffect(() => {
    setIsClient(true);
    
    // Check for saved license on client only
    const savedLicense = localStorage.getItem('markdown-pro-license');
    if (savedLicense) {
      setLicense({
        key: savedLicense,
        isValid: true
      });
    }
    
    // Check for saved theme
    const savedTheme = localStorage.getItem('markdown-pro-theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    // Check for saved markdown draft
    const savedDraft = localStorage.getItem('markdown-draft');
    if (savedDraft) {
      setMarkdown(savedDraft);
    }
  }, []); // Empty array means run once on mount

  // Theme handler - save to localStorage
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Save to localStorage only on client
    if (typeof window !== 'undefined') {
      localStorage.setItem('markdown-pro-theme', newTheme);
    }
  };

  // Export to HTML
  const exportToHtml = () => {
    if (!previewRef.current) return;
    
    const htmlContent = previewRef.current.innerHTML;
    const style = `
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          max-width: 800px; 
          margin: 0 auto; 
          padding: 40px; 
          line-height: 1.6;
          color: #333;
        }
        h1 { border-bottom: 2px solid #eaeaea; padding-bottom: 10px; }
        h2 { color: #555; }
        pre { 
          background: #f8f8f8; 
          padding: 20px; 
          border-radius: 8px; 
          overflow-x: auto;
          border-left: 4px solid #4f46e5;
        }
        code { 
          background: #f8f8f8; 
          padding: 3px 6px; 
          border-radius: 4px; 
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 14px;
        }
        blockquote { 
          border-left: 4px solid #ddd; 
          padding-left: 20px; 
          margin-left: 0; 
          color: #666;
          font-style: italic;
        }
        ul { padding-left: 20px; }
        li { margin: 8px 0; }
        a { color: #4f46e5; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    `;
    
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Markdown Export</title>
  ${style}
</head>
<body>
  ${htmlContent}
</body>
</html>`;
    
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `markdown-export-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle premium export
  const handlePremiumExport = () => {
    if (!license.isValid) {
      setIsPremiumModalOpen(true);
      return;
    }
    alert('✅ Premium PDF export feature!\n(Will be implemented with jsPDF)');
  };

  // Activate license - FIXED: Check for window
  const activateLicense = (key) => {
    // Simple mock validation
    const mockValid = key && key.length > 10;
    setLicense({
      key: key,
      isValid: mockValid
    });
    
    if (mockValid) {
      alert('🎉 Premium activated! You now have access to PDF export.');
      setIsPremiumModalOpen(false);
      setShowLicenseInput(false);
      
      // Save to localStorage only on client
      if (typeof window !== 'undefined') {
        localStorage.setItem('markdown-pro-license', key);
      }
    } else {
      alert('❌ Invalid license key. Please check and try again.');
    }
  };

  // Quick actions
  const quickActions = [
    { label: 'Heading', text: '# Heading', icon: 'H' },
    { label: 'Bold', text: '**bold text**', icon: 'B' },
    { label: 'List', text: '- List item', icon: '•' },
    { label: 'Code', text: '```code```', icon: '</>' },
    { label: 'Link', text: '[text](url)', icon: '🔗' },
  ];

  const insertText = (text) => {
    const textarea = document.querySelector('textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = markdown.substring(0, start) + text + markdown.substring(end);
    setMarkdown(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  // Save draft - FIXED: Check for window
  const saveDraft = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('markdown-draft', markdown);
      alert('Draft saved locally!');
    }
  };

  // Only render client-side features after component mounts
  if (!isClient) {
    // Show loading or basic version during server render
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Markdown Editor Pro</h1>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Header */}
      <header className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <FileText className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Markdown Pro</h1>
              <p className="text-sm text-gray-500">Beautiful writing, made simple</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
              title="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            <button
              onClick={() => navigator.clipboard.writeText(markdown)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
              title="Copy markdown"
            >
              <Copy size={20} />
            </button>
            
            {!license.isValid ? (
              <button
                onClick={() => setIsPremiumModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 transition flex items-center gap-2"
              >
                <Sparkles size={16} />
                Upgrade
              </button>
            ) : (
              <div className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-medium flex items-center gap-2">
                <Check size={14} />
                PRO
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Quick Actions Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-500 self-center">Quick insert:</span>
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => insertText(action.text)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}
            >
              <span className="font-bold mr-1.5">{action.icon}</span>
              {action.label}
            </button>
          ))}
          <button
            onClick={exportToHtml}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition flex items-center gap-1.5"
          >
            <Download size={14} />
            Export HTML
          </button>
        </div>
      </div>

      {/* Main Editor Area */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Editor Column */}
          <div className={`rounded-xl shadow-lg p-4 md:p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded">
                  <FileText className="text-blue-600 dark:text-blue-300" size={18} />
                </div>
                Editor
              </h2>
              <div className="text-sm text-gray-500">
                {markdown.split(/\s+/).length} words • {markdown.length} chars
              </div>
            </div>
            
            <textarea
              className={`w-full h-[500px] font-mono p-4 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="# Start typing your markdown here...\n\n## Features:\n- Live preview\n- HTML export\n- Dark/light theme\n- Keyboard shortcuts\n\n**Pro Tip**: Use # for headings, ** for bold, * for italic"
              spellCheck="false"
            />
            
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setMarkdown('')}
                className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Clear
              </button>
              <button
                onClick={() => {
                  const sample = `# Sample Document\n\n## Introduction\nThis is a **sample markdown** to get you started.\n\n### Features:\n1. Live preview\n2. Export options\n3. Theme support\n\n\`\`\`javascript\n// Code example\nfunction hello() {\n  console.log("Hello Markdown!");\n}\n\`\`\`\n\n> This is a blockquote\n\nVisit [Markdown Guide](https://www.markdownguide.org) for more syntax.`;
                  setMarkdown(sample);
                }}
                className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Load Sample
              </button>
              <button
                onClick={saveDraft}
                className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-1.5"
              >
                <Save size={14} />
                Save Draft
              </button>
            </div>
          </div>

          {/* Preview Column */}
          <div className={`rounded-xl shadow-lg p-4 md:p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <div className="p-1.5 bg-green-100 dark:bg-green-900 rounded">
                  <FileText className="text-green-600 dark:text-green-300" size={18} />
                </div>
                Live Preview
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={exportToHtml}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1.5"
                >
                  <Download size={14} />
                  HTML
                </button>
                
                <button
                  onClick={handlePremiumExport}
                  className={`px-3 py-1.5 text-sm rounded-lg transition flex items-center gap-1.5 ${license.isValid ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}
                  disabled={!license.isValid}
                >
                  {license.isValid ? 'Export PDF' : 'PDF (Pro)'}
                </button>
              </div>
            </div>
            
            <div
              ref={previewRef}
              className={`h-[500px] overflow-auto p-4 md:p-6 rounded-lg border prose prose-lg max-w-none ${theme === 'dark' ? 'prose-invert bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-300'}`}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdown || '*Start typing in the editor to see preview here...*'}
              </ReactMarkdown>
            </div>
            
            <div className="mt-4 text-sm text-gray-500 flex items-center gap-2">
              <Check size={14} />
              <span>Renders: Headings • Lists • Code • Links • Tables • Quotes</span>
            </div>
          </div>
        </div>

        {/* Pricing/Features Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-5 rounded-xl shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded">
                <FileText className="text-blue-600 dark:text-blue-300" size={16} />
              </div>
              Free Plan
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check size={14} className="text-green-500" />
                <span>Live Markdown preview</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-green-500" />
                <span>HTML export</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-green-500" />
                <span>Dark/light themes</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-green-500" />
                <span>Copy to clipboard</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold">$0<span className="text-sm font-normal text-gray-500">/forever</span></div>
              <button
                className="w-full mt-2 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                disabled
              >
                Current Plan
              </button>
            </div>
          </div>
          
          <div className={`p-5 rounded-xl shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-2 border-purple-500`}>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                POPULAR
              </span>
            </div>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <div className="p-1.5 bg-purple-100 dark:bg-purple-900 rounded">
                <Sparkles className="text-purple-600 dark:text-purple-300" size={16} />
              </div>
              Pro Plan
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check size={14} className="text-purple-500" />
                <span><strong>PDF export</strong> with custom styles</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-purple-500" />
                <span>Cloud sync & version history</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-purple-500" />
                <span>Custom CSS themes</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-purple-500" />
                <span>Priority support</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold">$3<span className="text-sm font-normal text-gray-500">/month</span></div>
              <button
                onClick={() => setIsPremiumModalOpen(true)}
                className="w-full mt-2 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 transition"
              >
                {license.isValid ? 'Manage License' : 'Upgrade Now'}
              </button>
            </div>
          </div>
          
          <div className={`p-5 rounded-xl shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <div className="p-1.5 bg-pink-100 dark:bg-pink-900 rounded">
                <Settings className="text-pink-600 dark:text-pink-300" size={16} />
              </div>
              Custom
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Need custom features or white-label solution? We can build exactly what you need.
            </p>
            <ul className="space-y-2 text-sm mb-4">
              <li>• Custom branding</li>
              <li>• API access</li>
              <li>• Team collaboration</li>
              <li>• Self-hosting</li>
            </ul>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <a
                href="mailto:custom@example.com"
                className="block w-full text-center py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Contact for Pricing
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-8 mt-8 border-t border-gray-200 dark:border-gray-800">
        <div className="text-center text-gray-500 text-sm">
          <p>Markdown Pro • Built with Next.js & Tailwind CSS</p>
          <p>A Product of <span class="text-blue-500">Akshaya Tech Ventures</span></p>
          <p className="mt-2">
            <a href="https://github.com/acbhaskar1" className="hover:text-purple-600 transition">GitHub</a> • 
            <a href="#" className="hover:text-purple-600 transition mx-4">Privacy</a> • 
            <a href="#" className="hover:text-purple-600 transition">Terms</a>
          </p>
        </div>
      </footer>

      {/* Premium Modal */}
      {isPremiumModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold">🚀 Go Pro!</h2>
                <p className="text-gray-600 dark:text-gray-400">Unlock all premium features</p>
              </div>
              <button
                onClick={() => setIsPremiumModalOpen(false)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                ✕
              </button>
            </div>
            
            {!showLicenseInput ? (
              <>
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-2xl font-bold">$3<span className="text-sm font-normal">/month</span></div>
                      <div className="text-sm">One-time payment: $30/year (save $6)</div>
                    </div>
                    <Sparkles className="text-purple-500" size={32} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <button
                    onClick={() => window.open('https://gumroad.com/l/markdown-pro', '_blank')}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 transition"
                  >
                    Buy on Gumroad
                  </button>
                  
                  <button
                    onClick={() => setShowLicenseInput(true)}
                    className="w-full py-3 border border-purple-600 text-purple-600 dark:text-purple-400 rounded-lg font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition"
                  >
                    I already have a license key
                  </button>
                  
                  <div className="text-center">
                    <button
                      onClick={() => {
                        // 7-day trial activation
                        const trialKey = 'TRIAL-' + Date.now();
                        activateLicense(trialKey);
                      }}
                      className="text-sm text-gray-500 hover:text-purple-600 transition"
                    >
                      Try 7-day free trial
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Enter your Gumroad license key
                  </label>
                  <input
                    type="text"
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    value={license.key}
                    onChange={(e) => setLicense({...license, key: e.target.value})}
                    className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-300'}`}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Find your key in Gumroad purchase email or account page
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => activateLicense(license.key)}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 transition"
                  >
                    Activate License
                  </button>
                  <button
                    onClick={() => setShowLicenseInput(false)}
                    className="px-6 py-3 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    Back
                  </button>
                </div>
              </>
            )}
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
              <p>✅ 7-day money back guarantee</p>
              <p>✅ Cancel anytime</p>
              <p>✅ Free updates forever</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}