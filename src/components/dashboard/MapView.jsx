import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getUrgency, getMarkerColor } from './UrgencyBadge';

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, zoom || map.getZoom());
  }, [center]);
  return null;
}

export default function MapView({ filings, onSelectFiling, selectedId }) {
  const [mapCenter] = useState([27.5, -82.0]);

  const grouped = {};
  filings.forEach(f => {
    if (f.latitude && f.longitude) {
      const key = `${f.latitude.toFixed(4)},${f.longitude.toFixed(4)}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(f);
    }
  });

  return (
    <div className="flex-1 relative">
      <MapContainer
        center={mapCenter}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {Object.entries(grouped).map(([key, group]) => {
          const [lat, lng] = key.split(',').map(Number);
          const f = group[0];
          const urgency = getUrgency(f.days_to_auction, f.filing_type);
          const color = getMarkerColor(urgency);
          const isSelected = group.some(g => g.id === selectedId);
          const count = group.length;

          return (
            <CircleMarker
              key={key}
              center={[lat, lng]}
              radius={count > 1 ? 14 : 9}
              pathOptions={{
                fillColor: color,
                fillOpacity: 0.9,
                color: isSelected ? '#4257A7' : 'white',
                weight: isSelected ? 3 : 2,
              }}
              eventHandlers={{
                click: () => onSelectFiling(f)
              }}
            >
              <Popup className="freshlien-popup">
                <div className="min-w-[200px]">
                  {group.slice(0, 3).map((filing, i) => (
                    <div
                      key={filing.id}
                      className="cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                      onClick={() => onSelectFiling(filing)}
                    >
                      {i > 0 && <hr className="my-1.5" />}
                      <p className="font-semibold text-xs text-gray-900 leading-tight">{filing.address_full}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-medium text-blue-600">{filing.filing_type}</span>
                        {filing.judgment_amount && (
                          <span className="text-[10px] text-gray-500">${Number(filing.judgment_amount).toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {group.length > 3 && (
                    <p className="text-[10px] text-gray-400 mt-1 text-center">+{group.length - 3} more</p>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-6 left-4 z-[1000] bg-white rounded-xl shadow-card border border-border p-3 text-xs">
        <p className="font-semibold text-foreground mb-2 text-[11px] uppercase tracking-wide">Urgency</p>
        {[
          { color: '#E63946', label: 'Auction < 7 days' },
          { color: '#F4A261', label: 'Auction 7–30 days' },
          { color: '#FFD166', label: 'Auction 30–90 days' },
          { color: '#4257A7', label: 'Pre-foreclosure / Appraisal' },
          { color: '#7B2D8B', label: 'Probate' },
          { color: '#94A3B8', label: 'REO / Post-auction' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2 mb-1 last:mb-0">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {/* Results count */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-secondary text-secondary-foreground text-xs font-medium px-4 py-1.5 rounded-full shadow-lg">
        {filings.length} results
        {filings.filter(f => f.latitude && f.longitude).length < filings.length && (
          <span className="text-white/60 ml-1">({filings.filter(f => f.latitude && f.longitude).length} mapped)</span>
        )}
      </div>
    </div>
  );
}