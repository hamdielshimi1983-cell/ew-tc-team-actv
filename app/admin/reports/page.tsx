'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/lib/use-supabase';
import { BackButton } from '@/components/back-button';

interface Report {
  id: string;
  submitted_by: string;
  campaign_name: string;
  current_spend: number;
  daily_status: string;
  report_date: string;
  impressions: number | null;
  clicks: number | null;
  conversions: number | null;
  ctr: number | null;
  cpc: number | null;
  roas: number | null;
  notes: string | null;
  created_at: string;
}

const USER_NAMES: Record<string, string> = {
  '1': 'Hamdi', '2': 'Hadeer', '3': 'Bakr', '4': 'Asmaa',
};

export default function AdminReportsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const supabase = useSupabase();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filterCampaign, setFilterCampaign] = useState('');
  const [totalSpend, setTotalSpend] = useState(0);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'Admin')) router.push('/dashboard');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) loadReports();
  }, [user]);

  const loadReports = async () => {
    const { data } = await supabase
      .from('daily_reports')
      .select('*')
      .order('report_date', { ascending: false });
    setReports(data || []);
    setTotalSpend(data?.reduce((sum, r) => sum + (r.current_spend || 0), 0) || 0);
  };

  const filteredReports = reports.filter(r =>
    !filterCampaign || r.campaign_name.toLowerCase().includes(filterCampaign.toLowerCase())
  );

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6"><BackButton /></div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Campaign Reports</h1>
          <p className="text-slate-600 mt-1">All reports submitted by Hadeer</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-500 font-medium">Total Reports</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{reports.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-500 font-medium">Total Spend</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">${totalSpend.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-500 font-medium">Campaigns</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">
              {new Set(reports.map(r => r.campaign_name)).size}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-4">
          <input
            type="text"
            value={filterCampaign}
            onChange={e => setFilterCampaign(e.target.value)}
            placeholder="🔍 Filter by campaign name..."
            className="w-full max-w-sm px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <p className="text-slate-500">No reports yet</p>
            </div>
          ) : (
            filteredReports.map(report => (
              <div key={report.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div
                  className="p-5 cursor-pointer hover:bg-slate-50"
                  onClick={() => setSelectedReport(selectedReport?.id === report.id ? null : report)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-lg">{report.campaign_name}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                        <span>👤 {USER_NAMES[report.submitted_by]}</span>
                        <span>📅 {new Date(report.report_date).toLocaleDateString()}</span>
                        <span className="font-semibold text-blue-600">${report.current_spend.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-slate-600 mt-2 line-clamp-1">{report.daily_status}</p>
                    </div>
                    <span className="text-slate-400">{selectedReport?.id === report.id ? '▼' : '▶'}</span>
                  </div>
                </div>

                {selectedReport?.id === report.id && (
                  <div className="border-t border-slate-200 p-5 bg-slate-50 space-y-4">
                    {/* KPI Grid */}
                    {(report.impressions || report.clicks || report.conversions || report.roas) && (
                      <div>
                        <p className="text-xs font-semibold text-slate-600 mb-3">KPI Metrics:</p>
                        <div className="grid grid-cols-3 gap-3">
                          {report.impressions && (
                            <div className="bg-white rounded-lg p-3 border border-slate-200 text-center">
                              <p className="text-xs text-slate-500">Impressions</p>
                              <p className="font-bold text-slate-900">{report.impressions.toLocaleString()}</p>
                            </div>
                          )}
                          {report.clicks && (
                            <div className="bg-white rounded-lg p-3 border border-slate-200 text-center">
                              <p className="text-xs text-slate-500">Clicks</p>
                              <p className="font-bold text-slate-900">{report.clicks.toLocaleString()}</p>
                            </div>
                          )}
                          {report.conversions && (
                            <div className="bg-white rounded-lg p-3 border border-slate-200 text-center">
                              <p className="text-xs text-slate-500">Conversions</p>
                              <p className="font-bold text-slate-900">{report.conversions.toLocaleString()}</p>
                            </div>
                          )}
                          {report.ctr && (
                            <div className="bg-white rounded-lg p-3 border border-slate-200 text-center">
                              <p className="text-xs text-slate-500">CTR</p>
                              <p className="font-bold text-slate-900">{report.ctr}%</p>
                            </div>
                          )}
                          {report.cpc && (
                            <div className="bg-white rounded-lg p-3 border border-slate-200 text-center">
                              <p className="text-xs text-slate-500">CPC</p>
                              <p className="font-bold text-slate-900">${report.cpc}</p>
                            </div>
                          )}
                          {report.roas && (
                            <div className="bg-white rounded-lg p-3 border border-slate-200 text-center">
                              <p className="text-xs text-slate-500">ROAS</p>
                              <p className="font-bold text-green-600">{report.roas}x</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-1">Daily Status:</p>
                      <p className="text-sm text-slate-800 bg-white p-3 rounded-lg border border-slate-200">{report.daily_status}</p>
                    </div>

                    {report.notes && (
                      <div>
                        <p className="text-xs font-semibold text-slate-600 mb-1">Additional Notes:</p>
                        <p className="text-sm text-slate-800 bg-white p-3 rounded-lg border border-slate-200">{report.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
