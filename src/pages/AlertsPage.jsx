import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import EmptyState from '@/components/dashboard/EmptyState';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createAlert, deleteAlert, fetchAlerts, fetchCounties } from '@/lib/alertsService';
import { useAuth } from '@/lib/AuthContext';
import { Bell, Loader2, Trash2 } from 'lucide-react';

export default function AlertsPage() {
  const { isSupabaseConfigured } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [counties, setCounties] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [a, c] = await Promise.all([fetchAlerts(), fetchCounties()]);
      setAlerts(a);
      setCounties(c);
      setError('');
    } catch (err) {
      setError(err.message || 'Could not load alerts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [isSupabaseConfigured]);

  const handleAdd = async () => {
    if (!selectedCounty) return;
    setSaving(true);
    setError('');
    try {
      await createAlert(selectedCounty);
      setSelectedCounty('');
      await load();
    } catch (err) {
      setError(err.message || 'Could not create alert.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await deleteAlert(id);
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const alertCountyIds = new Set(alerts.map((a) => a.county_id));
  const availableCounties = counties.filter((c) => !alertCountyIds.has(c.id));

  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto p-8 max-w-3xl mx-auto w-full">
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">Alerts</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Get notified when new foreclosure filings appear in counties you follow.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
        )}

        <div className="saas-card p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold">Add county alert</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 space-y-1.5">
              <Label className="text-xs">County</Label>
              <Select value={selectedCounty} onValueChange={setSelectedCounty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a county" />
                </SelectTrigger>
                <SelectContent>
                  {availableCounties.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.county_name}, {c.state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="sm:self-end" disabled={!selectedCounty || saving} onClick={handleAdd}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add alert'}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : alerts.length === 0 ? (
          <div className="saas-card">
            <EmptyState
              title="No alerts configured"
              description="Add a county above to start tracking new filings."
            />
          </div>
        ) : (
          <ul className="space-y-2">
            {alerts.map((alert) => (
              <li
                key={alert.id}
                className="saas-card px-4 py-3 flex items-center justify-between gap-3"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {alert.counties?.county_name}, {alert.counties?.state}
                  </p>
                  <p className="text-xs text-muted-foreground">Email alerts enabled</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleRemove(alert.id)}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppLayout>
  );
}
