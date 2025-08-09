// Plain JS version for Speed Camera Notifier

let map = null;
let userMarker = null;
let cameras = [];
const notification = document.getElementById('notification');
const toastEl = document.getElementById('toast');
const shareBtn = document.getElementById('shareBtn');
const menuToggle = document.getElementById('menuToggle');
const flyoutMenu = document.getElementById('flyoutMenu');

// Branded camera icon (uses project images)
const cameraIcon = L.icon({
  iconUrl: 'img/SpeedCamGlyph.svg',
  iconRetinaUrl: 'img/SpeedCamGlyph.svg',
  iconSize: [56, 'auto'],
  iconAnchor: [28, 28], // center anchor so marker sits on exact lat/lng
  popupAnchor: [0, -14]
});

function showNotification(msg) {
  notification.textContent = msg;
  notification.style.display = 'block';
}

function hideNotification() {
  notification.style.display = 'none';
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
      showNotification(`Speed camera nearby: ${cam.LOCATION || ''}`);
      // Voice notification
      if (window.speechSynthesis && !checkProximity._speaking) {
        const utter = new SpeechSynthesisUtterance('Speed camera nearby');
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
      title: cam.LOCATION || 'Speed Camera',
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

function watchPosition() {
  if (!navigator.geolocation) return;
  navigator.geolocation.watchPosition(
    pos => {
      const { latitude, longitude } = pos.coords;
      if (userMarker) {
        userMarker.setLatLng([latitude, longitude]);
        map.setView([latitude, longitude]);
      } else if (map) {
        userMarker = L.marker([latitude, longitude], {
          title: 'You are here',
          icon: L.divIcon({
            className: '',
            html: '<div style="color:green;font-size:28px;line-height:28px;display:flex;align-items:center;justify-content:center;width:32px;height:32px;background:white;border-radius:50%;border:4px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.2);">🚘</div>'
          })
        }).addTo(map).bindPopup('<div class="user-info-window">You are here</div>');
        map.setView([latitude, longitude]);
      }
      checkProximity(latitude, longitude);
    },
    err => console.error(err),
    { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
  );
}


function initMap() {
  map = L.map('map').setView([43.7, -79.4], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  // Add a single test marker at the center
  L.marker([43.7, -79.4], {
    title: 'Test Marker'
  }).addTo(map);
  fetchCameras();
  watchPosition();
}

// Simple toast helper
function showToast(message, timeout = 2200) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add('show');
  window.clearTimeout(showToast._timer);
  showToast._timer = window.setTimeout(() => {
    toastEl.classList.remove('show');
    toastEl.textContent = '';
  }, timeout);
}

async function handleShare() {
  const shareData = {
    title: 'SpeedCarma',
    text: 'Check out SpeedCarma – live proximity alerts for Toronto speed cameras.',
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
  initMenu();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Fly-out menu logic
function initMenu() {
  if (!menuToggle || !flyoutMenu) return;

  const setOpen = (open) => {
    flyoutMenu.classList.toggle('open', open);
    flyoutMenu.setAttribute('aria-hidden', String(!open));
    menuToggle.setAttribute('aria-expanded', String(open));
  };

  const isOpen = () => flyoutMenu.classList.contains('open');

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!isOpen());
  });

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (!isOpen()) return;
    if (!flyoutMenu.contains(e.target) && e.target !== menuToggle) {
      setOpen(false);
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) setOpen(false);
  });
}

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
