'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useInterventions } from '@/hooks/useInterventions';
import { useAuthStore } from '@/store/auth.store';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { fetchInterventions, interventions } = useInterventions();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      await fetchInterventions({ take: 100 });
      setIsLoading(false);
    };

    loadData();
  }, [fetchInterventions]);

  useEffect(() => {
    if (interventions.length > 0) {
      const resolved = interventions.filter((i) => i.status === 'resolved').length;
      const pending = interventions.filter((i) => i.status === 'pending').length;
      const inProgress = interventions.filter((i) => i.status === 'in_progress').length;

      setStats({
        total: interventions.length,
        resolved,
        pending,
        inProgress,
      });
    }
  }, [interventions]);

  const chartData = [
    { name: 'Résolues', value: stats?.resolved || 0 },
    { name: 'En cours', value: stats?.inProgress || 0 },
    { name: 'En attente', value: stats?.pending || 0 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Bienvenue, {user?.firstName}
          </h1>
          <p className="text-slate-400">Tableau de bord des interventions informatiques</p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <p className="text-slate-400 text-sm mb-2">Total interventions</p>
            <p className="text-3xl font-bold text-white">{stats?.total || 0}</p>
          </div>
          <div className="card">
            <p className="text-slate-400 text-sm mb-2">Résolues</p>
            <p className="text-3xl font-bold text-green-400">{stats?.resolved || 0}</p>
          </div>
          <div className="card">
            <p className="text-slate-400 text-sm mb-2">En cours</p>
            <p className="text-3xl font-bold text-blue-400">{stats?.inProgress || 0}</p>
          </div>
          <div className="card">
            <p className="text-slate-400 text-sm mb-2">En attente</p>
            <p className="text-3xl font-bold text-yellow-400">{stats?.pending || 0}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Statistiques des interventions</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Interventions */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4">Interventions récentes</h2>
          {isLoading ? (
            <p className="text-slate-400">Chargement...</p>
          ) : interventions.length > 0 ? (
            <div className="space-y-2">
              {interventions.slice(0, 5).map((intervention) => (
                <div
                  key={intervention.id}
                  className="flex justify-between items-center p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-white">{intervention.title}</p>
                    <p className="text-sm text-slate-400">{intervention.ticketNumber}</p>
                  </div>
                  <span className={`badge ${
                    intervention.status === 'resolved' ? 'badge-success' :
                    intervention.status === 'in_progress' ? 'badge-info' :
                    'badge-warning'
                  }`}>
                    {intervention.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">Aucune intervention</p>
          )}
        </div>
      </div>
    </div>
  );
}
