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
  const { incidents, camps, roadReports, setIsSosModalOpen } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);

  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<{ type: 'incident' | 'camp' | 'road'; data: any } | null>(null);

  // Initialize Leaflet map centered on Assam
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (leafletMapRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    const map = L.map(mapContainerRef.current, {
      center: [26.2006, 92.9376],
      zoom: 8,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Light CartoDB Voyager tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
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

  // Render markers
  useEffect(() => {
    const map = leafletMapRef.current;
    const L = (window as any).L;
    if (!map || !L) return;

    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    const createCustomIcon = (bgColor: string, iconSymbol: string, pulse: boolean = false) => {
      return L.divIcon({
        className: 'custom-map-icon',
        html: `
          <div class="relative flex items-center justify-center w-8 h-8 rounded-full ${bgColor} border-2 border-white shadow-lg text-white font-bold text-xs ${pulse ? 'animate-bounce' : ''}">
            ${pulse ? `<span class="absolute -inset-1 rounded-full ${bgColor} opacity-60 animate-ping"></span>` : ''}
            <span class="relative">${iconSymbol}</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
    };

    if (selectedFilter === 'all' || selectedFilter === 'sos') {
      incidents.forEach(inc => {
        if (selectedDistrict !== 'all' && inc.district !== selectedDistrict) return;
        if (searchQuery && !inc.village.toLowerCase().includes(searchQuery.toLowerCase()) && !inc.description.toLowerCase().includes(searchQuery.toLowerCase())) return;

        const isCritical = inc.severity === 'critical';
        const color = isCritical ? 'bg-rose-500' : inc.severity === 'high' ? 'bg-amber-500' : 'bg-sky-500';
        const icon = createCustomIcon(color, '🆘', isCritical);

        const marker = L.marker([inc.lat, inc.lng], { icon }).addTo(map);
        marker.on('click', () => setSelectedItem({ type: 'incident', data: inc }));
      });
    }

    if (selectedFilter === 'all' || selectedFilter === 'camps') {
      camps.forEach(camp => {
        if (selectedDistrict !== 'all' && camp.district !== selectedDistrict) return;
        if (searchQuery && !camp.name.toLowerCase().includes(searchQuery.toLowerCase())) return;

        const icon = createCustomIcon('bg-emerald-500', '⛺');
        const marker = L.marker([camp.lat, camp.lng], { icon }).addTo(map);
        marker.on('click', () => setSelectedItem({ type: 'camp', data: camp }));
      });
    }

    if (selectedFilter === 'all' || selectedFilter === 'roads') {
      roadReports.forEach(road => {
        if (selectedDistrict !== 'all' && road.district !== selectedDistrict) return;
        const icon = createCustomIcon('bg-purple-500', '🚧');
        const marker = L.marker([road.lat, road.lng], { icon }).addTo(map);
        marker.on('click', () => setSelectedItem({ type: 'road', data: road }));
      });
    }
  }, [incidents, camps, roadReports, selectedFilter, selectedDistrict, searchQuery]);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden bg-slate-50">
      {/* Top Floating Control Bar - Light Pastel Theme */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-pink-200 shadow-xl">
          {/* Search Bar */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search village, camp, landmark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-500 w-48 sm:w-64"
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
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedFilter === f.id
                    ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-pink-50 hover:text-pink-600'
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
          className="pointer-events-auto bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-xl shadow-pink-500/30 border border-rose-300 animate-sos-pulse"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Pin Emergency SOS</span>
        </button>
      </div>

      {/* Map Element Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Slide-over Inspector Drawer */}
      {selectedItem && (
        <div className="absolute right-4 top-20 bottom-4 w-full max-w-sm z-30 bg-white/95 backdrop-blur-xl border border-pink-200 rounded-2xl shadow-2xl p-5 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200 text-slate-900">
          <div>
            <div className="flex items-center justify-between border-b border-pink-100 pb-3 mb-4">
              <span className="text-xs uppercase font-extrabold tracking-wider text-pink-600 flex items-center gap-1.5">
                {selectedItem.type === 'incident' && <ShieldAlert className="w-4 h-4 text-rose-500" />}
                {selectedItem.type === 'camp' && <Tent className="w-4 h-4 text-emerald-500" />}
                {selectedItem.type === 'road' && <Navigation className="w-4 h-4 text-purple-500" />}
                {selectedItem.type.toUpperCase()} DETAILS
              </span>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-500 hover:text-slate-900 text-xs bg-slate-100 px-2 py-1 rounded font-semibold"
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
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        {inc.district}
                        <span className={`badge-${inc.severity}`}>{inc.severity.toUpperCase()}</span>
                      </h3>
                      <p className="text-xs text-slate-500">{inc.village} ({inc.landmark})</p>
                    </div>
                    <span className="text-xs text-pink-700 font-bold bg-pink-50 px-2 py-1 rounded border border-pink-200">
                      AI Priority: {inc.aiVulnerabilityScore}/100
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-2">
                    <p className="text-slate-800 font-medium">{inc.description}</p>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                      <div>👶 Children: <strong className="text-slate-900">{inc.demographics.children}</strong></div>
                      <div>👵 Elderly: <strong className="text-slate-900">{inc.demographics.elderly}</strong></div>
                      <div>♿ Disabled: <strong className="text-slate-900">{inc.demographics.disabled}</strong></div>
                      <div>🤰 Pregnant: <strong className="text-slate-900">{inc.demographics.pregnant}</strong></div>
                      <div>🐾 Animals: <strong className="text-slate-900">{inc.demographics.animals}</strong></div>
                      <div>👥 Adults: <strong className="text-slate-900">{inc.demographics.adults}</strong></div>
                    </div>
                  </div>

                  {inc.photos.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-1.5">Attached Evidence:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {inc.photos.map((url, i) => (
                          <img key={i} src={url} alt="SOS attachment" className="w-full h-24 object-cover rounded-lg border border-slate-200" />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-sky-600" />
                      <span>Reporter: {inc.reporterName} ({inc.reporterPhone})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Status: <strong className="text-emerald-700 uppercase font-bold">{inc.status}</strong></span>
                    </div>
                    {inc.assignedTeamName && (
                      <div className="text-xs bg-sky-50 border border-sky-200 p-2 rounded-lg text-sky-800 font-medium">
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
                    <h3 className="text-base font-bold text-slate-900">{camp.name}</h3>
                    <p className="text-xs text-slate-500">{camp.district} • Contact: {camp.contactPhone}</p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">Live Occupancy</span>
                      <span className="text-emerald-700 font-bold">{camp.currentOccupancy} / {camp.capacity} ({occPct}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: `${occPct}%` }}></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                    <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200 text-emerald-800">
                      ✓ Food & Water
                    </div>
                    <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200 text-emerald-800">
                      ✓ Medical Bay
                    </div>
                    <div className="bg-pink-50 p-2 rounded-xl border border-pink-200 text-pink-800">
                      ✓ Women & Child Safe
                    </div>
                    <div className="bg-purple-50 p-2 rounded-xl border border-purple-200 text-purple-800">
                      {camp.petFriendly ? '✓ Pet Shelter' : '✕ No Pets'}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="pt-4 border-t border-pink-100 space-y-2">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${selectedItem.data.lat},${selectedItem.data.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
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
