// Initialize map, user marker, and routing
let map = null;
let userMarker = null;
let cameras = [];
let locationPermissionPrompted = false;
let routingControl = null;
let routingMode = false;
let routePoints = [];
// Helper: get API key from .env if available (for dev), or from window/global
function getORSApiKey() {
  // In production, you may want to inject this securely
  return window.ORS_API_KEY || '';
}
// Helper: count cameras near a route polyline
function countCamerasOnRoute(routeLine, thresholdMeters = 100) {
  if (!routeLine || !cameras.length) return 0;
  let count = 0;
  cameras.forEach(cam => {
    const camLatLng = L.latLng(cam.lat, cam.lng);
    // Find min distance from camera to any segment of the route
    let minDist = Infinity;
    for (let i = 0; i < routeLine.length - 1; i++) {
      const segStart = L.latLng(routeLine[i][0], routeLine[i][1]);
      const segEnd = L.latLng(routeLine[i+1][0], routeLine[i+1][1]);
      const dist = L.GeometryUtil ? L.GeometryUtil.distanceSegment(map, camLatLng, segStart, segEnd) : camLatLng.distanceTo(segStart);
      if (dist < minDist) minDist = dist;
    }
    if (minDist <= thresholdMeters) count++;
  });
  return count;
}
// Routing: let user select start/end points, then show route and count cameras
function enableRoutingMode() {
  if (!map) return;
  routingMode = true;
  routePoints = [];
  showToast('Click the map to select a starting point.');
  map.on('click', onMapClickForRoute);
}

function onMapClickForRoute(e) {
  routePoints.push([e.latlng.lat, e.latlng.lng]);
  if (routePoints.length === 1) {
    showToast('Click the map to select an ending point.');
  } else if (routePoints.length === 2) {
    map.off('click', onMapClickForRoute);
    showToast('Calculating route...');
    showRoute(routePoints[0], routePoints[1]);
    routingMode = false;
  }
}

function showRoute(start, end) {
  // Remove previous route if any
  if (routingControl) {
    map.removeLayer(routingControl);
    routingControl = null;
  }
  // Remove any existing directions panel
  const existingPanel = document.querySelector('.custom-directions-panel');
  if (existingPanel) {
    existingPanel.remove();
  }
  // Call backend proxy for ORS route
  const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001/api/route'
    : '/api/route';
  fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ coordinates: [start, end], profile: 'driving-car' })
  })
    .then(res => res.json())
    .then(data => {
      if (!data || !data.features || !data.features[0]) {
        showToast('No route found.', 3000);
        return;
      }
      const coords = data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      routingControl = L.polyline(coords, { color: 'var(--theme-color-red)', weight: 6 }).addTo(map);
      map.fitBounds(routingControl.getBounds(), { padding: [40, 40] });
      const camCount = countCamerasOnRoute(coords);
      
      // Create custom directions panel
      const segment = data.features[0].properties.segments[0];
      const steps = segment.steps || [];
      const summary = segment.summary || {};
      
      const panel = document.createElement('div');
      panel.className = 'custom-directions-panel leaflet-routing-container';
      panel.innerHTML = `
        <div class="leaflet-routing-close">×</div>
        <div class="leaflet-routing-header">
          <!--
          <div>Distance: ${(summary.distance / 1000).toFixed(1)} km</div>
          <div>Duration: ${Math.round(summary.duration / 60)} min</div>
          <div>Speed cameras: ${camCount}</div>
          -->
          <div>Optimal Route:</div>

        </div>
        <div class="leaflet-routing-alt">
          ${steps.map((step, idx) => `
            <div class="leaflet-routing-instruction">
              <div class="leaflet-routing-instruction-text">${step.instruction}</div>
              <div class="leaflet-routing-instruction-distance">${(step.distance / 1000).toFixed(2)} km</div>
            </div>
          `).join('')}
        </div>
      `;
      
      /* Position and style the panel
      panel.style.position = 'absolute';
      panel.style.top = '100px';
      panel.style.right = '11px';
      panel.style.zIndex = '1000';
      panel.style.maxHeight = '62vh';
      panel.style.overflowY = 'auto';
      */
      // Add close button functionality
      panel.querySelector('.leaflet-routing-close').addEventListener('click', () => {
        if (routingControl && map) {
          map.removeLayer(routingControl);
          routingControl = null;
        }
        panel.remove();
      });
      
      document.body.appendChild(panel);
      showToast(`Number of speed cameras encountered en route: ${camCount}`, 0);
    })
    .catch(() => showToast('Error contacting routing service.', 3000));
}

// Notification elements
const notification = document.getElementById('notification');
const toastEl = document.getElementById('toast');
const shareBtn = document.getElementById('shareBtn');
const menuToggle = document.getElementById('menuToggle');

// Branded camera icon (uses project images)
const cameraIcon = L.icon({
  iconUrl: 'img/SpeedCamGlyph.svg',
  iconRetinaUrl: 'img/SpeedCamGlyph.svg',
  iconSize: [50, 'auto'],
  iconAnchor: [25, 25], // center anchor so marker sits on exact lat/lng
  popupAnchor: [0, -14]
});


function showNotification(msg) {
  if (!notification) return;
  // Add close button and message
  notification.innerHTML = `<button id="notification-close-btn">&times;</button><span>${msg}</span>`;
  if (typeof notification.showPopover === 'function') {
    notification.showPopover();
  } else {
    notification.style.display = 'block'; // fallback
  }
  // Add close button handler
  const closeBtn = document.getElementById('notification-close-btn');
  if (closeBtn) {
    closeBtn.onclick = hideNotification;
  }
}

function hideNotification() {
  if (!notification) return;
  if (typeof notification.hidePopover === 'function') {
    notification.hidePopover();
  } else {
    notification.style.display = 'none'; // fallback
  }
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Proximity of User to Speed Cameras triggers the notification
function checkProximity(lat, lng) {
  const threshold = 0.125; // km
  for (const cam of cameras) {
    const dist = getDistanceFromLatLonInKm(lat, lng, cam.lat, cam.lng);
    if (dist < threshold) {
      showNotification(`Speed camera nearby: ${cam.location || ''}`);
      // Voice notification
      if (window.speechSynthesis && !checkProximity._speaking) {
        const utter = new SpeechSynthesisUtterance(`Speed camera nearby, at ${cam.location}`);
        utter.rate = 1.1;
        utter.pitch = 1.0;
        utter.volume = 1.0;
        checkProximity._speaking = true;
        utter.onend = () => { checkProximity._speaking = false; };
        window.speechSynthesis.speak(utter);
      }
      return;
    }
  }
  hideNotification();
  // Reset speaking flag if not in proximity
  checkProximity._speaking = false;
}

function addCameraMarkers() {
  if (!map) return;
  cameras.forEach(cam => {
    const marker = L.marker([cam.lat, cam.lng], {
      title: cam.location || 'Speed Camera',
      icon: cameraIcon
    }).addTo(map);
    const infoContent = `
      <div style="min-width:180px;">
        <strong>Status:</strong> ${cam.status || cam.Status || cam.STATUS || ''}<br>
        <strong>Location:</strong> ${cam.location || cam.LOCATION || ''}<br>
        <strong>Location Code:</strong> ${cam.location_code || cam.Location_Code || cam.LOCATION_CODE || ''}
      </div>
    `;
    marker.bindPopup(infoContent);
  });
}

async function fetchCameras() {
  const url = 'https://services3.arcgis.com/b9WvedVPoizGfvfD/ArcGIS/rest/services/COT_SPEED_CAMERAS/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&token=&f=json';
  const res = await fetch(url);
  const data = await res.json();
  cameras = data.features.map(f => ({
    lat: f.geometry.y, // using WGS84 - World Geodetic System 1984
    lng: f.geometry.x, // WGS84
    ...f.attributes
  }));
  addCameraMarkers();
}

function watchPosition(triggeredByUser = false) {
  if (!navigator.geolocation) return;
  let firstFix = true;
  navigator.geolocation.watchPosition(
    pos => {
      hideLocationPermissionPrompt();
      const { latitude, longitude } = pos.coords;
      if (userMarker) {
        userMarker.setLatLng([latitude, longitude]);
        if (firstFix) {
          map.setView([latitude, longitude]);
          firstFix = false;
        }
      } else if (map) {
        // User marker centred on their location
        userMarker = L.marker([latitude, longitude], {
          title: 'You are here',
          icon: L.divIcon({
            className: '',
            html: '<div style="font-size:20px;display:flex;align-items:center;justify-content:center;width:32px;height:32px;background:white;border-radius:50%;border:6px solid #fff;box-shadow:var(--theme-drop-shadow);">🚘</div>'
          })
        }).addTo(map).bindPopup('<div class="user-info-window">You are here</div>');
        map.setView([latitude, longitude]);
        firstFix = false;
      }
      checkProximity(latitude, longitude);
    },
    err => {
      if (!locationPermissionPrompted && (err.code === 1 || err.code === 2 || err.code === 3)) {
        showLocationPermissionPrompt();
        locationPermissionPrompted = true;
      }
      console.error(err);
    },
    { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
  );
}

function showLocationPermissionPrompt() {
  const el = document.getElementById('location-permission');
  if (el) el.style.display = 'flex';
}
function hideLocationPermissionPrompt() {
  const el = document.getElementById('location-permission');
  if (el) el.style.display = 'none';
}


function initMap() {
  map = L.map('map').setView([43.7, -79.4], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  fetchCameras();
  watchPosition();
  // Initialize geocoder control but do not add to map yet
  window._spcGeocoder = L.Control.geocoder({
    defaultMarkGeocode: true
  });
  window._spcGeocoderAdded = false;
}

// Simple toast helper
function showToast(message, timeout = 2200) {
  if (!toastEl) return;
  // If timeout is 0, make persistent with close button
  if (timeout === 0) {
    toastEl.innerHTML = `<button id="toast-close-btn" class="toast-close-btn">×</button><p>${message}</p>`;
    toastEl.classList.add('show');
    window.clearTimeout(showToast._timer);
    setTimeout(() => {
      const closeBtn = document.getElementById('toast-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          toastEl.classList.remove('show');
          toastEl.innerHTML = '';
        });
      }
    }, 0);
  } else {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => {
      toastEl.classList.remove('show');
      toastEl.textContent = '';
    }, timeout);
  }
}

async function handleShare() {
  const shareData = {
    title: 'SpeedCarma',
    text: 'Check Out SpeedCarma | Live Proximity Alerts for Toronto Speed Cameras.',
    url: window.location.href
  };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
      // Many browsers show their own UI; toast is a nice confirmation
      showToast('Thanks for sharing!');
    } else {
      // Fallback: copy URL to clipboard
      await navigator.clipboard.writeText(shareData.url);
      showToast('Link copied to clipboard');
    }
  } catch (err) {
    // User cancelled or permission denied; degrade to copy if possible
    try {
      await navigator.clipboard.writeText(shareData.url);
      showToast('Link copied to clipboard');
    } catch (_) {
      showToast('Unable to share');
    }
  }
}

function initShare() {
  if (!shareBtn) return;
  // Toggle label visibility based on support
  if (!navigator.share) {
    shareBtn.setAttribute('data-fallback', 'true');
    shareBtn.title = 'Copy link';
  }
  shareBtn.addEventListener('click', handleShare);
}

function init() {
  initMap();
  initShare();
  // Set up route button to enable routing mode
  const routeBtn = document.getElementById('routeBtn');
  if (routeBtn) {
    routeBtn.addEventListener('click', () => {
      enableRoutingMode();
    });
  }

  // Set up search button to show geocoder
  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      if (window._spcGeocoder && map) {
        // Only add geocoder control once
        if (!window._spcGeocoderAdded) {
          window._spcGeocoder.addTo(map);
          window._spcGeocoderAdded = true;
        }
        // Open the geocoder input immediately
        const geocoderContainer = window._spcGeocoder._container;
        if (geocoderContainer) {
          // Find the geocoder's toggle button and simulate a click if input is not visible
          const input = geocoderContainer.querySelector('input');
          if (input && input.offsetParent === null) {
            // Input is hidden, so click the toggle button
            const toggleBtn = geocoderContainer.querySelector('button.leaflet-control-geocoder-icon');
            if (toggleBtn) toggleBtn.click();
          }
          // Focus the input (in case it's now visible)
          setTimeout(() => {
            const inputNow = geocoderContainer.querySelector('input');
            if (inputNow) inputNow.focus();
          }, 0);
        }
      }
    });
  }

  // Set up locate button to center map on user's current location
  const locateBtn = document.getElementById('locateBtn');
  if (locateBtn) {
    locateBtn.addEventListener('click', () => {
      if (userMarker && map) {
        const latlng = userMarker.getLatLng();
        map.setView(latlng, map.getZoom());
        showToast('Centered on your location');
      } else {
        // If no userMarker, try to trigger geolocation (will prompt if not granted)
        showLocationPermissionPrompt();
        // Optionally, try to get location again
        watchPosition(true);
      }
    });
  }

  // Set up enable location button in permission prompt
  const enableLocationBtn = document.getElementById('enableLocationBtn');
  if (enableLocationBtn) {
    enableLocationBtn.addEventListener('click', () => {
      hideLocationPermissionPrompt();
      // Try to get location again (will prompt if not granted)
      watchPosition(true);
    });
  }

  // Check geolocation permission on load and show prompt if needed
  if (navigator.permissions) {
    navigator.permissions.query({ name: 'geolocation' }).then(result => {
      if (result.state === 'denied' || result.state === 'prompt') {
        showLocationPermissionPrompt();
      }
      result.onchange = function() {
        if (result.state === 'granted') {
          hideLocationPermissionPrompt();
        } else {
          showLocationPermissionPrompt();
        }
      };
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Fly-out menu logic

// Service Worker registration (basic)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        // If there's an already waiting SW, prompt immediately
        if (reg.waiting) {
          notifyUpdate(reg.waiting);
        }

        reg.addEventListener('updatefound', () => {
          const nw = reg.installing;
          if (nw) {
            nw.addEventListener('statechange', () => {
              if (nw.state === 'installed' && navigator.serviceWorker.controller) {
                notifyUpdate(nw);
              }
            });
          }
        });

        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (refreshing) return;
            refreshing = true;
            window.location.reload();
        });
      })
      .catch(err => console.error('SW registration failed', err));
  });
}

function notifyUpdate(worker) {
  // Build a lightweight action toast (reuse existing toastEl if available)
  if (!toastEl) {
    console.log('Update available for SpeedCarma');
    return;
  }
  toastEl.innerHTML = 'New version available <button id="sw-reload-btn" style="margin-left:8px;padding:4px 10px;border:none;border-radius:4px;background:#1976d2;color:#fff;cursor:pointer;font-size:.85em;">Reload</button>';
  toastEl.classList.add('show');
  const btn = document.getElementById('sw-reload-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      // Tell waiting/installed worker to skip waiting
      if (worker && worker.state === 'installed') {
        worker.postMessage({ type: 'SKIP_WAITING' });
      }
    });
  }
  // Auto-hide after 15s if user ignores (but keep worker waiting until interaction)
  window.clearTimeout(notifyUpdate._timer);
  notifyUpdate._timer = window.setTimeout(() => {
    toastEl.classList.remove('show');
  }, 15000);
}
