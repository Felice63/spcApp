### Leaflet

Leaflet is a free, open-source JavaScript library for creating interactive maps. Leaflet  is the library that provides the map interface and functionality. To display a map, you need to use a tile provider.

The tile providers may have their own terms of service and pricing. Many people use OpenStreetMap, which is also a free and open-source option. Other providers like Mapbox or Esri offer free tiers, but may charge for high usage.


### The JSON data is being fetched from this URL:

https://services3.arcgis.com/b9WvedVPoizGfvfD/ArcGIS/rest/services/COT_SPEED_CAMERAS/FeatureServer/0/query?where=1%3D1%20&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&token=&f=json


### This is a map viewer

https://www.arcgis.com/apps/mapviewer/index.html?url=https://services3.arcgis.com/b9WvedVPoizGfvfD/ArcGIS/rest/services/COT_SPEED_CAMERAS/FeatureServer&source=sd


### TO DO

- FlyOut menu with other links
- Activate other Leaflet map features like trails etc. 
- It would be a sub menu configure interface show trails parks etc other Toronto items from their data

### Core Leaflet (built-in, no plugins)

- Proximity radius ring: Visualize the 0.25 km threshold around the user.
    - Add a circle that follows the user: L.circle([lat,lng], { radius: 250 })

### Plugins

- Marker clustering: Keep the map fast and clean when zoomed out.
    - Plugin: Leaflet.markercluster; swap L.layerGroup of markers for a cluster group

- Geocoder/Search: Find an address/intersection quickly.
    - Plugin: Leaflet Control Geocoder; L.Control.geocoder().addTo(map)

### UX/polish (small changes)

- Better camera icons. Use your img/SpeedCamGlyph-* for consistent branding.
    - Use L.icon({ iconUrl, iconSize, iconAnchor }) instead of the emoji div

- Attribution/controls layout: Move/compact controls so they never overlap footer credits.

### Non-Leaflet extras (tiny and safe)

- PWA basics: Manifest + icons for “Add to Home Screen” (helps sharing and repeat use)

If you want, I can implement any two of these right now (e.g., Scale bar + Proximity circle), then add a basemap switcher or clustering next.