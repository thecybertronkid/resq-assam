import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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
  AlertTriangle,
  Info,
  Radio,
  Package,
  Building,
  ArrowRight,
  X
} from 'lucide-react';

export const LiveIncidentMap: React.FC = () => {
  const { incidents, camps, roadReports, setIsSosModalOpen, role, setActiveTab, showToast } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<{ type: 'incident' | 'camp' | 'road'; data: any } | null>(null);
  const [showCtrlHint, setShowCtrlHint] = useState(false);

  // Initialize Leaflet map centered on Assam
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (leafletMapRef.current) return;

    // Initialize map with scrollWheelZoom: false to prevent accidental scrolling zoom
    const map = L.map(mapContainerRef.current, {
      center: [26.2006, 92.9376],
      zoom: 8,
      zoomControl: false,
      scrollWheelZoom: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Reliable OpenStreetMap tile layer
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    leafletMapRef.current = map;

    // Ctrl + Scroll Zoom Handler
    const container = mapContainerRef.current;
    let hintTimeout: any = null;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        if (leafletMapRef.current) {
          if (e.deltaY < 0) {
            leafletMapRef.current.zoomIn();
          } else if (e.deltaY > 0) {
            leafletMapRef.current.zoomOut();
          }
        }
      } else {
        setShowCtrlHint(true);
        if (hintTimeout) clearTimeout(hintTimeout);
        hintTimeout = setTimeout(() => setShowCtrlHint(false), 2000);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    // Trigger map resize recalculation after DOM render
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      if (hintTimeout) clearTimeout(hintTimeout);
      container.removeEventListener('wheel', handleWheel);
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Render markers when data or filters change
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    // Custom colored DivIcon generator
    const createCustomIcon = (bgColor: string, iconSymbol: string, pulse: boolean = false) => {
      return L.divIcon({
        className: 'custom-map-icon',
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 9999px;
            background-color: ${bgColor};
            border: 2px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            color: white;
            font-weight: bold;
            font-size: 13px;
            cursor: pointer;
          ">
            ${iconSymbol}
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
        const color = isCritical ? '#f43f5e' : inc.severity === 'high' ? '#f59e0b' : '#0284c7';
        const icon = createCustomIcon(color, '🆘', isCritical);

        const marker = L.marker([inc.lat, inc.lng], { icon }).addTo(map);
        marker.on('click', () => setSelectedItem({ type: 'incident', data: inc }));
      });
    }

    // Filtered Relief Camps
    if (selectedFilter === 'all' || selectedFilter === 'camps') {
      camps.forEach(camp => {
        if (selectedDistrict !== 'all' && camp.district !== selectedDistrict) return;
        if (searchQuery && !camp.name.toLowerCase().includes(searchQuery.toLowerCase()) && !camp.district.toLowerCase().includes(searchQuery.toLowerCase())) return;

        const icon = createCustomIcon('#10b981', '⛺');
        const marker = L.marker([camp.lat, camp.lng], { icon }).addTo(map);
        marker.on('click', () => setSelectedItem({ type: 'camp', data: camp }));
      });
    }

    // Filtered Roads
    if (selectedFilter === 'all' || selectedFilter === 'roads') {
      roadReports.forEach(road => {
        if (selectedDistrict !== 'all' && road.district !== selectedDistrict) return;
        const icon = createCustomIcon('#8b5cf6', '🚧');
        const marker = L.marker([road.lat, road.lng], { icon }).addTo(map);
        marker.on('click', () => setSelectedItem({ type: 'road', data: road }));
      });
    }
  }, [incidents, camps, roadReports, selectedFilter, selectedDistrict, searchQuery]);

  return (
    <div className="relative w-full h-[calc(100vh-5.5rem)] min-h-[500px] flex flex-col md:flex-row overflow-hidden bg-slate-50">
      {/* Top Floating Control Bar - Responsive Mobile Container */}
      <div className="absolute top-3 left-3 right-3 z-[500] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pointer-events-none">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pointer-events-auto bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-slate-200 shadow-lg">
          {/* Search Bar */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search village, camp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-56 bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-500 font-medium"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-none">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'sos', label: '🆘 SOS' },
              { id: 'camps', label: '⛺ Camps' },
              { id: 'roads', label: '🚧 Roads' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedFilter === f.id
                    ? 'bg-pink-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-pink-50 hover:text-pink-600'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Role Action CTA Button */}
        <div className="pointer-events-auto flex items-center gap-2 self-end sm:self-auto">
          {role === 'rescue' && (
            <button
              onClick={() => setActiveTab('rescue')}
              className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg border border-rose-300"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Triage Queue</span>
            </button>
          )}
          {role === 'volunteer' && (
            <button
              onClick={() => setActiveTab('volunteer')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg border border-emerald-300"
            >
              <Radio className="w-4 h-4" />
              <span>Tasks</span>
            </button>
          )}
          {role === 'ngo' && (
            <button
              onClick={() => setActiveTab('ngo')}
              className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg border border-purple-300"
            >
              <Package className="w-4 h-4" />
              <span>Warehouse</span>
            </button>
          )}
          {role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className="bg-amber-600 hover:bg-amber-500 text-white font-extrabold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg border border-amber-300"
            >
              <Building className="w-4 h-4" />
              <span>War Room</span>
            </button>
          )}
          {role === 'citizen' && (
            <button
              onClick={() => setIsSosModalOpen(true)}
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg border border-rose-300 animate-sos-pulse"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Pin SOS</span>
            </button>
          )}
        </div>
      </div>

      {/* Ctrl + Scroll Zoom Overlay Hint */}
      {showCtrlHint && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[700] bg-slate-900/90 backdrop-blur-md text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-fade-in border border-slate-700 pointer-events-none text-center max-w-xs">
          <Info className="w-4 h-4 text-sky-400 shrink-0" />
          <span>Use <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-600">Ctrl</kbd> + scroll to zoom map</span>
        </div>
      )}

      {/* Map Element Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10 min-h-[500px]" />

      {/* Responsive Slide-up Sheet / Slide-over Drawer */}
      {selectedItem && (
        <div className="fixed md:absolute inset-x-0 bottom-0 md:bottom-4 md:right-4 md:left-auto md:top-20 z-[600] w-full md:max-w-sm bg-white/95 backdrop-blur-xl border border-slate-200 rounded-t-3xl md:rounded-2xl shadow-2xl p-5 flex flex-col justify-between overflow-y-auto animate-fade-in text-slate-900 max-h-[80vh] md:max-h-none">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <span className="text-xs uppercase font-extrabold tracking-wider text-pink-600 flex items-center gap-1.5">
                {selectedItem.type === 'incident' && <ShieldAlert className="w-4 h-4 text-rose-500" />}
                {selectedItem.type === 'camp' && <Tent className="w-4 h-4 text-emerald-500" />}
                {selectedItem.type === 'road' && <Navigation className="w-4 h-4 text-purple-500" />}
                {selectedItem.type.toUpperCase()} DETAILS
              </span>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-500 hover:text-slate-900 text-xs bg-slate-100 p-1.5 rounded-full font-bold"
              >
                <X className="w-4 h-4" />
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
                      <p className="text-xs text-slate-500 font-medium">{inc.village} ({inc.landmark})</p>
                    </div>
                    <span className="text-xs text-pink-700 font-bold bg-pink-50 px-2 py-1 rounded border border-pink-200 shrink-0">
                      AI: {inc.aiVulnerabilityScore}/100
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

                  {/* Role Tailored Action Box */}
                  <div className="p-3 rounded-xl border bg-pink-50/60 border-pink-200 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-pink-700 block">
                      Active Role Action ({role.toUpperCase()}):
                    </span>
                    {role === 'rescue' && (
                      <button
                        onClick={() => { setActiveTab('rescue'); showToast(`🚁 Assigned Boat Unit to Incident ${inc.id}!`); }}
                        className="w-full bg-rose-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
                      >
                        Assign NDRF Boat Unit →
                      </button>
                    )}
                    {role === 'volunteer' && (
                      <button
                        onClick={() => showToast(`🦺 Volunteer accepted task for Incident ${inc.id}!`)}
                        className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
                      >
                        Accept Field Volunteer Task →
                      </button>
                    )}
                    {role === 'ngo' && (
                      <button
                        onClick={() => { setActiveTab('ngo'); showToast(`📦 Allocated 100 ration kits for Incident ${inc.id}!`); }}
                        className="w-full bg-purple-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
                      >
                        Allocate Relief Ration →
                      </button>
                    )}
                    {role === 'admin' && (
                      <button
                        onClick={() => { setActiveTab('admin'); showToast(`🏛️ Moderate AI Duplicate Flag for ${inc.id}!`); }}
                        className="w-full bg-amber-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
                      >
                        Moderate AI Duplicate Flag →
                      </button>
                    )}
                    {role === 'citizen' && (
                      <button
                        onClick={() => showToast(`🆘 Requesting priority evacuation for ${inc.id}...`)}
                        className="w-full bg-sky-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
                      >
                        Request Priority Evacuation →
                      </button>
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
                    <p className="text-xs text-slate-500 font-medium">{camp.district} • Contact: {camp.contactPhone}</p>
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

                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200 text-emerald-800">✓ Food & Water</div>
                    <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200 text-emerald-800">✓ Medical Bay</div>
                    <div className="bg-pink-50 p-2 rounded-xl border border-pink-200 text-pink-800">✓ Women/Child Safe</div>
                    <div className="bg-purple-50 p-2 rounded-xl border border-purple-200 text-purple-800">{camp.amenities?.petFriendly ? '✓ Pet Shelter' : '✕ No Pets'}</div>
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${selectedItem.data.lat},${selectedItem.data.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
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
