import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { AnalysisMode } from '../types';
import { analyzeCode } from '../services/gemini';
import { Spinner } from '../components/Spinner';

export const Home: React.FC = () => {
  const [code, setCode] = useState('');
  const [mode, setMode] = useState<AnalysisMode>(AnalysisMode.EXPLAIN);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const result = await analyzeCode(code, mode);
      setResponse(result);

      // If mode is IMPROVE, extract the code block and update the editor
      if (mode === AnalysisMode.IMPROVE) {
        const extractedCode = extractCodeBlock(result);
        if (extractedCode) {
          setCode(extractedCode);
        }
      }
      
    } catch (error) {
      console.error("Analysis failed", error);
      setResponse("An error occurred while analyzing the code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to extract code from markdown code blocks
  const extractCodeBlock = (markdown: string): string | null => {
    // Regex to match content inside ``` ... ```
    // Handles optional language identifier
    const codeBlockRegex = /```(?:\w+)?\s*([\s\S]*?)```/;
    const match = markdown.match(codeBlockRegex);
    if (match && match[1]) {
      return match[1].trim(); // Return the code content
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto pt-24 pb-12 px-6">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight mb-3">
          Refine your code with AI.
        </h1>
        <p className="text-neutral-500 text-lg max-w-xl mx-auto">
          Paste your snippet below and let Gemini explain, debug, or improve it in seconds.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden mb-8 transition-shadow hover:shadow-md">
        <div className="p-1 bg-neutral-50 border-b border-neutral-200 flex flex-wrap gap-2 items-center justify-between px-4 py-3">
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-red-400"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span className="w-3 h-3 rounded-full bg-green-400"></span>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Mode:</label>
            <select 
              value={mode}
              onChange={(e) => setMode(e.target.value as AnalysisMode)}
              className="bg-white border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-black focus:border-black block px-3 py-1.5 outline-none font-medium cursor-pointer hover:border-neutral-400 transition-colors"
            >
              {Object.values(AnalysisMode).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
        
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="// Paste your code here..."
          className="w-full h-64 p-6 font-mono text-sm text-neutral-800 bg-white resize-none focus:outline-none placeholder-neutral-300"
          spellCheck={false}
        />

        <div className="px-6 py-4 bg-white border-t border-neutral-100 flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={loading || !code.trim()}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all
              ${loading || !code.trim() 
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' 
                : 'bg-black text-white hover:bg-neutral-800 shadow-lg hover:shadow-xl translate-y-0 active:translate-y-0.5'
              }
            `}
          >
            {loading ? <><Spinner /> Analyzing...</> : 'Analyze Code'}
          </button>
        </div>
      </div>

      {/* Response Section */}
      {response && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="flex items-center gap-3 mb-4">
              <div className="h-px bg-neutral-200 flex-1"></div>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Analysis Result</span>
              <div className="h-px bg-neutral-200 flex-1"></div>
           </div>

           <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-8 prose prose-neutral max-w-none prose-pre:bg-neutral-50 prose-pre:text-neutral-900 prose-pre:border prose-pre:border-neutral-200 prose-pre:rounded-xl">
              <ReactMarkdown>{response}</ReactMarkdown>
           </div>
        </div>
      )}

      {/* Empty State / Prompt */}
      {!response && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {[
              { title: 'Explain', desc: 'Get a clear natural language walkthrough of complex functions.' },
              { title: 'Debug', desc: 'Identify syntax errors, logical bugs, and security risks.' },
              { title: 'Improve', desc: 'Refactor for cleaner, more efficient, and modern syntax.' },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-2xl bg-white border border-neutral-100 shadow-sm text-center">
                <h3 className="font-semibold text-neutral-900 mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};