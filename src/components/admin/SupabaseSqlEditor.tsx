import React, { useState } from 'react';
import { 
  Database, 
  Play, 
  Terminal, 
  Copy, 
  Check, 
  RotateCcw, 
  Table, 
  ShieldAlert, 
  Sparkles, 
  FileCode, 
  Layers, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { executeSqlConsoleQuery } from '../../services/supabaseService';
import { isSupabaseConfigured } from '../../lib/supabase';

const PRESET_SQL_QUERIES = [
  {
    name: '1. Inspect Pages & Status',
    category: 'Pages',
    query: `SELECT id, title, slug, status, updated_at FROM pages ORDER BY updated_at DESC;`
  },
  {
    name: '2. Inspect Page Sections',
    category: 'Pages',
    query: `SELECT id, page_id, section_type, name, sort_order, is_visible FROM page_sections ORDER BY sort_order ASC;`
  },
  {
    name: '3. View Revision History',
    category: 'Pages',
    query: `SELECT id, page_id, revision_name, created_by, created_at FROM page_revisions ORDER BY created_at DESC;`
  },
  {
    name: '4. View All Products & Stock',
    category: 'Catalog',
    query: `SELECT id, name, category, price, stock, is_best_seller FROM products ORDER BY price DESC LIMIT 20;`
  },
  {
    name: '5. View All Orders & Fulfillment',
    category: 'Orders',
    query: `SELECT id, order_number, customer_name, total_amount, status, created_at FROM orders ORDER BY created_at DESC LIMIT 20;`
  },
  {
    name: '6. Check Admin Profiles & RBAC',
    category: 'Security',
    query: `SELECT id, full_name, email, role, created_at FROM profiles WHERE role IN ('admin', 'super_admin', 'manager');`
  },
  {
    name: '7. Fix/Add user_id Column Compatibility',
    category: 'Fix & Migration',
    query: `-- Compatibility fix: Add user_id alias to profiles table if needed
DO $$ 
BEGIN 
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='user_id') THEN
      ALTER TABLE public.profiles ADD COLUMN user_id UUID REFERENCES auth.users(id);
      UPDATE public.profiles SET user_id = id WHERE user_id IS NULL;
    END IF;
  END IF;
END $$;`
  },
  {
    name: '8. Full Schema DDL (Bootstrap)',
    category: 'Setup',
    query: `-- Create pages, sections and revisions tables
CREATE TABLE IF NOT EXISTS public.pages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.page_sections (
  id TEXT PRIMARY KEY,
  page_id TEXT NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  settings_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.page_revisions (
  id TEXT PRIMARY KEY,
  page_id TEXT NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  revision_name TEXT NOT NULL,
  snapshot_json JSONB NOT NULL,
  created_by TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`
  }
];

export const SupabaseSqlEditor: React.FC = () => {
  const [sqlQuery, setSqlQuery] = useState<string>(PRESET_SQL_QUERIES[0].query);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [queryResult, setQueryResult] = useState<{
    success: boolean;
    rows?: any[];
    rowCount?: number;
    error?: string;
    executedAt?: string;
    durationMs?: number;
  } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleExecute = async () => {
    if (!sqlQuery.trim()) return;
    setIsExecuting(true);
    const start = performance.now();
    try {
      const res = await executeSqlConsoleQuery(sqlQuery);
      const end = performance.now();
      setQueryResult({
        ...res,
        executedAt: new Date().toLocaleTimeString(),
        durationMs: Math.round(end - start)
      });
    } catch (err: any) {
      setQueryResult({
        success: false,
        error: err?.message || 'SQL execution failed.',
        executedAt: new Date().toLocaleTimeString()
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlQuery);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="supabase-sql-editor-container" className="space-y-6">
      {/* Header & Connection status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-zinc-100 text-lg flex items-center gap-2">
              Supabase SQL Studio Console
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
                PostgreSQL
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Direct live query terminal to inspect <code className="text-amber-400">pages</code>, <code className="text-amber-400">page_sections</code>, <code className="text-amber-400">page_revisions</code> & audit store data.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="copy-sql-btn"
            onClick={handleCopy}
            className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700 transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy SQL'}</span>
          </button>
          <button
            id="execute-sql-btn"
            onClick={handleExecute}
            disabled={isExecuting}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isExecuting ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-white" />
            )}
            <span>{isExecuting ? 'Executing...' : 'Run Query'}</span>
          </button>
        </div>
      </div>

      {/* Preset Query Templates */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Quick SQL Templates & Schemas
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_SQL_QUERIES.map((preset, idx) => (
            <button
              key={idx}
              id={`sql-preset-${idx}`}
              onClick={() => {
                setSqlQuery(preset.query);
                setQueryResult(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                sqlQuery === preset.query
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* SQL Editor Textarea */}
      <div className="rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl">
        <div className="px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2 font-mono">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>Query Editor (Ctrl+Enter / Cmd+Enter to run)</span>
          </div>
          <button
            onClick={() => setSqlQuery('')}
            className="text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 text-[11px]"
          >
            <RotateCcw className="w-3 h-3" /> Clear
          </button>
        </div>

        <textarea
          id="sql-code-editor"
          value={sqlQuery}
          onChange={(e) => setSqlQuery(e.target.value)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              e.preventDefault();
              handleExecute();
            }
          }}
          rows={7}
          spellCheck={false}
          className="w-full p-4 bg-zinc-950 text-emerald-400 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-y leading-relaxed"
          placeholder="SELECT * FROM pages;"
        />
      </div>

      {/* Query Result View */}
      {queryResult && (
        <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 overflow-hidden space-y-3 p-5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              {queryResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400" />
              )}
              <span className="text-xs font-semibold text-zinc-200">
                {queryResult.success ? 'Query Executed Successfully' : 'Query Failed'}
              </span>
            </div>
            <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-3">
              {queryResult.rowCount !== undefined && (
                <span>Rows: <strong className="text-zinc-200">{queryResult.rowCount}</strong></span>
              )}
              {queryResult.durationMs !== undefined && (
                <span>Time: <strong className="text-zinc-200">{queryResult.durationMs}ms</strong></span>
              )}
              {queryResult.executedAt && (
                <span>At: {queryResult.executedAt}</span>
              )}
            </div>
          </div>

          {queryResult.error ? (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs">
              {queryResult.error}
            </div>
          ) : queryResult.rows && queryResult.rows.length > 0 ? (
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950/60 text-zinc-400 font-mono">
                    {Object.keys(queryResult.rows[0]).map((key) => (
                      <th key={key} className="px-3.5 py-2.5 font-semibold text-zinc-300">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono text-zinc-300">
                  {queryResult.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-zinc-800/40 transition-colors">
                      {Object.values(row).map((val: any, cIdx) => (
                        <td key={cIdx} className="px-3.5 py-2 whitespace-nowrap text-zinc-300">
                          {typeof val === 'object' && val !== null ? (
                            <span className="text-amber-300/90 text-[11px]">{JSON.stringify(val).substring(0, 45)}...</span>
                          ) : typeof val === 'boolean' ? (
                            <span className={val ? 'text-emerald-400' : 'text-rose-400'}>{String(val)}</span>
                          ) : val === null || val === undefined ? (
                            <span className="text-zinc-600 italic">null</span>
                          ) : (
                            String(val)
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-zinc-500 font-mono">
              Statement executed. 0 rows returned.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
