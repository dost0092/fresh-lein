import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { format } from 'date-fns';
import { getUrgency, getMarkerColor } from './UrgencyBadge';
import { getMappableFilings } from '@/lib/foreclosureUtils';

function FitBounds({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    if (points.length === 1) {
      map.setView(points[0], 13);
      return;
    }

    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 12 });
  }, [map, points]);

  return null;
}

function formatPopupDate(d) {
  try {
    return d ? format(new Date(d), 'MMM d, yyyy') : '—';
  } catch {
    return '—';
  }
}

export default function MapView({ filings, onSelectFiling, selectedId }) {
  const mappable = useMemo(() => getMappableFilings(filings), [filings]);

  const points = useMemo(
    () => mappable.map((f) => [Number(f.latitude), Number(f.longitude)]),
    [mappable]
  );

  const defaultCenter = useMemo(() => {
    if (points.length) return points[0];
    return [39.8283, -98.5795];
  }, [points]);

  const grouped = useMemo(() => {
    const g = {};
    mappable.forEach((f) => {
      const lat = Number(f.latitude);
      const lng = Number(f.longitude);
      const key = `${lat.toFixed(5)},${lng.toFixed(5)}`;
      if (!g[key]) g[key] = [];
      g[key].push(f);
    });
    return g;
  }, [mappable]);

  const unmappedCount = filings.length - mappable.length;

  return (
    <div className="absolute inset-0 z-0">
      <MapContainer
        center={defaultCenter}
        zoom={points.length ? 8 : 4}
        style={{ height: '100%', width: '100%', minHeight: '480px' }}
        zoomControl
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {points.length > 0 && <FitBounds points={points} />}

        {Object.entries(grouped).map(([key, group]) => {
          const [lat, lng] = key.split(',').map(Number);
          const f = group[0];
          const urgency = getUrgency(f.days_to_auction, f.status === 'Appraisal' ? 'PRE' : 'NTS');
          const color = getMarkerColor(urgency);
          const isSelected = group.some((g) => g.id === selectedId);
          const count = group.length;

          return (
            <CircleMarker
              key={key}
              center={[lat, lng]}
              radius={count > 1 ? 14 : 10}
              pathOptions={{
                fillColor: color,
                fillOpacity: 0.92,
                color: isSelected ? '#445aa6' : '#ffffff',
                weight: isSelected ? 3 : 2,
              }}
              eventHandlers={{
                click: () => onSelectFiling(f),
              }}
            >
              <Popup>
                <div className="min-w-[220px] max-w-[280px]">
                  {group.slice(0, 4).map((filing, i) => (
                    <div
                      key={filing.id}
                      role="button"
                      tabIndex={0}
                      className="cursor-pointer hover:bg-slate-50 p-2 rounded transition-colors"
                      onClick={() => onSelectFiling(filing)}
                      onKeyDown={(e) => e.key === 'Enter' && onSelectFiling(filing)}
                    >
                      {i > 0 && <hr className="my-2 border-slate-200" />}
                      <p className="font-semibold text-sm text-slate-900 leading-snug">
                        {filing.property_address}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {filing.city}, {filing.state} · {filing.county_name} Co.
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                          {filing.status}
                        </span>
                        <span className="text-[10px] text-slate-600">
                          Sale {formatPopupDate(filing.sale_date)}
                        </span>
                      </div>
                      {filing.starting_bid != null && (
                        <p className="text-xs font-medium text-slate-800 mt-1">
                          Opening ${Number(filing.starting_bid).toLocaleString()}
                        </p>
                      )}
                    </div>
                  ))}
                  {group.length > 4 && (
                    <p className="text-[10px] text-slate-400 mt-1 text-center">
                      +{group.length - 4} more at this location
                    </p>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      <div className="absolute bottom-6 left-4 z-[1000] bg-white rounded-xl shadow-card border border-border p-3 text-xs pointer-events-none">
        <p className="font-semibold text-foreground mb-2 text-[11px] uppercase tracking-wide">Auction urgency</p>
        {[
          { color: '#E63946', label: '< 7 days' },
          { color: '#F4A261', label: '7–30 days' },
          { color: '#FFD166', label: '30–90 days' },
          { color: '#445aa6', label: 'Appraisal / no date' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2 mb-1 last:mb-0">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-secondary text-secondary-foreground text-xs font-medium px-4 py-1.5 rounded-full shadow-lg pointer-events-none">
        {mappable.length} on map
        {filings.length !== mappable.length && (
          <span className="opacity-70 ml-1">/ {filings.length} total</span>
        )}
        {unmappedCount > 0 && (
          <span className="opacity-70 ml-1">· {unmappedCount} need coordinates</span>
        )}
      </div>
    </div>
  );
}
