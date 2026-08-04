import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { IncidentReport, ReliefCamp, RoadReport } from '../../types';
import { 
  Filter, 
  MapPin, 
  ShieldAlert, 
  Tent, 
  Hospital, 
  Navigation, 
  Users, 
  Search, 
  ExternalLink,
  Phone,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const LiveIncidentMap: React.FC = () => {
  const { incidents, camps, roadReports, setIsSosModalOpen, setActiveTab, updateIncidentStatus } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);

  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<{ type: 'incident' | 'camp' | 'road'; data: any } | null>(null);

  // Initialize Leaflet map centered on Assam (Guwahati ~ 26.1445, 91.7362)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (leafletMapRef.current) return; // already initialized

    // Import leaflet dynamically or use window.L
    const L = (window as any).L;
    if (!L) return;

    const map = L.map(mapContainerRef.current, {
      center: [26.2006, 92.9376], // Assam center
      zoom: 8,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Dark vector tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    leafletMapRef.current = map;

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Render markers when data or filters change
  useEffect(() => {
    const map = leafletMapRef.current;
    const L = (window as any).L;
    if (!map || !L) return;

    // Clear existing markers
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    // Helper for custom colored DivIcon
    const createCustomIcon = (bgColor: string, iconSymbol: string, pulse: boolean = false) => {
      return L.divIcon({
        className: 'custom-map-icon',
        html: `
          <div class="relative flex items-center justify-center w-8 h-8 rounded-full ${bgColor} border-2 border-white shadow-xl text-white font-bold text-xs ${pulse ? 'animate-bounce' : ''}">
            ${pulse ? `<span class="absolute -inset-1 rounded-full ${bgColor} opacity-60 animate-ping"></span>` : ''}
            <span class="relative">${iconSymbol}</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
    };

    // Filtered Incidents
    if (selectedFilter === 'all' || selectedFilter === 'sos') {
      incidents.forEach(inc => {
        if (selectedDistrict !== 'all' && inc.district !== selectedDistrict) return;
        if (searchQuery && !inc.village.toLowerCase().includes(searchQuery.toLowerCase()) && !inc.description.toLowerCase().includes(searchQuery.toLowerCase())) return;

        const isCritical = inc.severity === 'critical';
        const color = isCritical ? 'bg-red-600' : inc.severity === 'high' ? 'bg-amber-600' : 'bg-blue-600';
        const icon = createCustomIcon(color, '🆘', isCritical);

        const marker = L.marker([inc.lat, inc.lng], { icon }).addTo(map);
        marker.on('click', () => setSelectedItem({ type: 'incident', data: inc }));
      });
    }

    // Filtered Relief Camps
    if (selectedFilter === 'all' || selectedFilter === 'camps') {
      camps.forEach(camp => {
        if (selectedDistrict !== 'all' && camp.district !== selectedDistrict) return;
        if (searchQuery && !camp.name.toLowerCase().includes(searchQuery.toLowerCase())) return;

        const icon = createCustomIcon('bg-emerald-600', '⛺');
        const marker = L.marker([camp.lat, camp.lng], { icon }).addTo(map);
        marker.on('click', () => setSelectedItem({ type: 'camp', data: camp }));
      });
    }

    // Filtered Roads
    if (selectedFilter === 'all' || selectedFilter === 'roads') {
      roadReports.forEach(road => {
        if (selectedDistrict !== 'all' && road.district !== selectedDistrict) return;
        const icon = createCustomIcon('bg-purple-600', '🚧');
        const marker = L.marker([road.lat, road.lng], { icon }).addTo(map);
        marker.on('click', () => setSelectedItem({ type: 'road', data: road }));
      });
    }
  }, [incidents, camps, roadReports, selectedFilter, selectedDistrict, searchQuery]);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden bg-slate-950">
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto bg-slate-950/90 backdrop-blur-md p-2 rounded-2xl border border-slate-800 shadow-2xl">
          {/* Search Bar */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search village, camp, landmark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 w-48 sm:w-64"
            />
          </div>

          {/* Filter category chips */}
          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'sos', label: '🆘 SOS Emergencies' },
              { id: 'camps', label: '⛺ Relief Camps' },
              { id: 'roads', label: '🚧 Blocked Roads' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedFilter === f.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Report Floating CTA */}
        <button
          onClick={() => setIsSosModalOpen(true)}
          className="pointer-events-auto bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-xl shadow-red-600/40 border border-red-400 animate-sos-pulse"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Pin Emergency SOS</span>
        </button>
      </div>

      {/* Map Element Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Slide-over Inspector Drawer when a marker is clicked */}
      {selectedItem && (
        <div className="absolute right-4 top-20 bottom-4 w-full max-w-sm z-30 bg-slate-950/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-5 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 flex items-center gap-1.5">
                {selectedItem.type === 'incident' && <ShieldAlert className="w-4 h-4 text-red-500" />}
                {selectedItem.type === 'camp' && <Tent className="w-4 h-4 text-emerald-500" />}
                {selectedItem.type === 'road' && <Navigation className="w-4 h-4 text-purple-500" />}
                {selectedItem.type.toUpperCase()} DETAILS
              </span>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-white text-xs bg-slate-900 px-2 py-1 rounded"
              >
                Close ✕
              </button>
            </div>

            {/* INCIDENT DETAILS */}
            {selectedItem.type === 'incident' && (() => {
              const inc: IncidentReport = selectedItem.data;
              return (
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        {inc.district}
                        <span className={`badge-${inc.severity}`}>{inc.severity.toUpperCase()}</span>
                      </h3>
                      <p className="text-xs text-slate-400">{inc.village} ({inc.landmark})</p>
                    </div>
                    <span className="text-xs text-red-400 font-bold bg-red-950/60 px-2 py-1 rounded border border-red-900/50">
                      AI Priority: {inc.aiVulnerabilityScore}/100
                    </span>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs space-y-2">
                    <p className="text-slate-200 font-medium">{inc.description}</p>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                      <div>👶 Children: <strong className="text-white">{inc.demographics.children}</strong></div>
                      <div>👵 Elderly: <strong className="text-white">{inc.demographics.elderly}</strong></div>
                      <div>♿ Disabled: <strong className="text-white">{inc.demographics.disabled}</strong></div>
                      <div>🤰 Pregnant: <strong className="text-white">{inc.demographics.pregnant}</strong></div>
                      <div>🐾 Animals: <strong className="text-white">{inc.demographics.animals}</strong></div>
                      <div>👥 Adults: <strong className="text-white">{inc.demographics.adults}</strong></div>
                    </div>
                  </div>

                  {inc.photos.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-300 mb-1.5">Attached Evidence:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {inc.photos.map((url, i) => (
                          <img key={i} src={url} alt="SOS attachment" className="w-full h-24 object-cover rounded-lg border border-slate-800" />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-1 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-blue-400" />
                      <span>Reporter: {inc.reporterName} ({inc.reporterPhone})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Status: <strong className="text-emerald-400 uppercase">{inc.status}</strong></span>
                    </div>
                    {inc.assignedTeamName && (
                      <div className="text-xs bg-blue-950/40 border border-blue-800/40 p-2 rounded-lg text-blue-300">
                        Assigned Unit: {inc.assignedTeamName}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* CAMP DETAILS */}
            {selectedItem.type === 'camp' && (() => {
              const camp: ReliefCamp = selectedItem.data;
              const occPct = Math.round((camp.currentOccupancy / camp.capacity) * 100);
              return (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white">{camp.name}</h3>
                    <p className="text-xs text-slate-400">{camp.district} • Contact: {camp.contactPhone}</p>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">Live Occupancy</span>
                      <span className="text-emerald-400">{camp.currentOccupancy} / {camp.capacity} ({occPct}%)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: `${occPct}%` }}></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-900 p-2 rounded border border-slate-800 flex items-center gap-1.5 text-emerald-400">
                      ✓ Food & Water
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-800 flex items-center gap-1.5 text-emerald-400">
                      ✓ Medical Bay
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-800 flex items-center gap-1.5 text-emerald-400">
                      ✓ Women & Child Safe
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-800 flex items-center gap-1.5 text-purple-400">
                      {camp.petFriendly ? '✓ Pet Shelter' : '✕ No Pets'}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${selectedItem.data.lat},${selectedItem.data.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Navigate with Google Maps
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
