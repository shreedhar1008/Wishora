'use client';

import React from 'react';
import { Button, Card, Badge, Tabs, EmptyState } from '@/components/ui';
import { TEMPLATES } from '@/lib/templates/definitions';

interface AdminStats {
  templatesCount: number;
  publishedTemplates: number;
  demoWishesCount: number;
  reportsCount: number;
}

export default function AdminClientView({ 
  isSupabaseConfigured,
  stats
}: { 
  isSupabaseConfigured: boolean;
  stats: AdminStats;
}) {
  const [activeTab, setActiveTab] = React.useState('templates');
  // If Supabase is configured, middleware guarantees we are admin.
  // Otherwise, use the fake login for demo purposes.
  const [isAuthenticated, setIsAuthenticated] = React.useState(isSupabaseConfigured);
  const [adminKey, setAdminKey] = React.useState('');

  React.useEffect(() => {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('wishora-admin-auth');
      if (stored === 'true') setIsAuthenticated(true);
    }
  }, [isSupabaseConfigured]);

  const handleLogin = () => {
    if (adminKey === 'admin' || adminKey === 'wishora-admin') {
      setIsAuthenticated(true);
      localStorage.setItem('wishora-admin-auth', 'true');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
        <Card className="max-w-sm w-full">
          <div className="text-center mb-6">
            <span className="text-4xl block mb-3">🔐</span>
            <h1 className="text-xl font-bold text-charcoal">Admin Access</h1>
            <p className="text-sm text-charcoal-muted mt-1">Enter admin key to continue</p>
          </div>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Admin key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-charcoal focus:outline-none focus:ring-2 focus:ring-plum/30"
            />
            <Button variant="primary" className="w-full" onClick={handleLogin}>
              Access Admin Panel
            </Button>
            <p className="text-xs text-charcoal-muted text-center">
              Demo mode: use &quot;admin&quot; as the key
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-charcoal">Admin Panel</h1>
            <p className="text-sm text-charcoal-muted">Manage templates, reports, and content</p>
          </div>
          {!isSupabaseConfigured && (
            <Button
              variant="ghost"
              onClick={() => {
                setIsAuthenticated(false);
                localStorage.removeItem('wishora-admin-auth');
              }}
            >
              Sign Out
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Templates', value: stats.templatesCount, emoji: '🎨' },
            { label: 'Published', value: stats.publishedTemplates, emoji: '✅' },
            { label: 'Demo Wishes', value: stats.demoWishesCount, emoji: '💌' },
            { label: 'Reports', value: stats.reportsCount, emoji: '🚩' },
          ].map((stat) => (
            <Card key={stat.label} padding="md">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{stat.emoji}</span>
                <div>
                  <p className="text-2xl font-bold text-charcoal">{stat.value}</p>
                  <p className="text-sm text-charcoal-muted">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs
          tabs={[
            { id: 'templates', label: 'Templates', icon: <span>🎨</span> },
            { id: 'reports', label: 'Reports', icon: <span>🚩</span> },
            { id: 'system', label: 'System', icon: <span>⚙️</span> },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="mb-8"
        />

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-charcoal">All Templates ({TEMPLATES.length})</h2>
            </div>
            <div className="bg-surface rounded-2xl border border-border-light overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-light bg-ivory/50">
                      <th className="text-left p-4 font-medium text-charcoal-muted whitespace-nowrap">Template</th>
                      <th className="text-left p-4 font-medium text-charcoal-muted hidden md:table-cell whitespace-nowrap">Occasion</th>
                      <th className="text-left p-4 font-medium text-charcoal-muted hidden md:table-cell whitespace-nowrap">Popularity</th>
                      <th className="text-left p-4 font-medium text-charcoal-muted whitespace-nowrap">Status</th>
                      <th className="text-right p-4 font-medium text-charcoal-muted whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TEMPLATES.map((tpl) => (
                      <tr key={tpl.id} className="border-b border-border-light last:border-0 hover:bg-ivory/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{tpl.emoji}</span>
                            <div>
                              <p className="font-medium text-charcoal">{tpl.title}</p>
                              <p className="text-xs text-charcoal-muted">{tpl.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <Badge variant="default">{tpl.occasion}</Badge>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 rounded-full bg-ivory-dark overflow-hidden">
                              <div
                                className="h-full gradient-plum rounded-full"
                                style={{ width: `${tpl.popularity}%` }}
                              />
                            </div>
                            <span className="text-xs text-charcoal-muted">{tpl.popularity}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant={tpl.isPublished ? 'emerald' : 'coral'}>
                            {tpl.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <EmptyState
            icon={<span className="text-4xl">🚩</span>}
            title="No reports yet"
            description="Reports from users will appear here when wishes are flagged."
          />
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <Card padding="lg">
              <h3 className="font-semibold text-charcoal mb-4">System Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Mode</span>
                  <Badge variant={isSupabaseConfigured ? "emerald" : "gold"}>
                    {isSupabaseConfigured ? "Production Mode" : "Demo Mode"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Framework</span>
                  <span className="font-medium">Next.js 14 App Router</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Database</span>
                  <span className="font-medium">{isSupabaseConfigured ? "Supabase" : "In-Memory (Demo)"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Templates</span>
                  <span className="font-medium">{stats.templatesCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Supabase</span>
                  <Badge variant={isSupabaseConfigured ? "emerald" : "coral"}>
                    {isSupabaseConfigured ? "Configured" : "Not Configured"}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
