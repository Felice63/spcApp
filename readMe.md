### SpeedCarma

This simple Web App is a work in progress built with Vanilla Web Technologies. It uses [LeafletJS](https://leafletjs.com/), [OpenStreetMap](https://www.openstreetmap.org/), and the [City of Toronto public datasets](https://www.toronto.ca/city-government/data-research-maps/open-data/).

### Leaflet

Leaflet is a free, open-source JavaScript library for creating interactive maps. Leaflet  is the library that provides the map interface and functionality. To display a map, you need to use a tile provider.

The tile providers may have their own terms of service and pricing. This Web App uses OpenStreetMap. Other providers like [Mapbox](https://www.mapbox.com/) or [Esri](https://www.esri.com/en-us/home) offer free tiers but may charge for high usage.

### OpenStreetMap

OpenStreetMap (OSM) is a free, open-source online map and tile provider. Anyone can edit and contribute to the project by adding roads, buildings, parks, and other places. OSM is used in many apps, websites, and for geographic research.


### Public JSON data being fetched:

This Web App uses [public facing JSON data](https://services3.arcgis.com/b9WvedVPoizGfvfD/ArcGIS/rest/services/COT_SPEED_CAMERAS/FeatureServer/0/query?where=1%3D1%20&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&token=&f=json) maintained and curated by the [City of Toronto](https://www.toronto.ca/city-government/data-research-maps/open-data/)

### Feature Server Query form

[Can be found here](https://services3.arcgis.com/b9WvedVPoizGfvfD/ArcGIS/rest/services/COT_SPEED_CAMERAS/FeatureServer/0/query[])


### Map viewer

[Can be found here](https://www.arcgis.com/apps/mapviewer/index.html?url=https://services3.arcgis.com/b9WvedVPoizGfvfD/ArcGIS/rest/services/COT_SPEED_CAMERAS/FeatureServer&source=sd)

### Other Data provided by CoT

[Can be found here](https://services3.arcgis.com/b9WvedVPoizGfvfD/ArcGIS/rest/services/)


### To Do

- Add features via the drop-down menu
- Activate other Leaflet map features, such as trails etc. 
- User can customize the notifications - how many times they occur
- User can customize proximity

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

---

### License & Attribution

This project is released under the **MIT License** (see `LICENSE`).

Leaflet is © 2010–2025 Vladimir Agafonkin and contributors, under the **BSD 2-Clause License**. See the Leaflet project for full terms.

Map data © OpenStreetMap contributors. You must retain proper attribution when using OpenStreetMap tiles. For details, see: [openstreetmap.org/copyright](https://www.openstreetmap.org/copyright)

City of Toronto speed & red light camera data provided via the public ArcGIS FeatureServer endpoint listed above; subject to the City's open data terms found [here](https://www.toronto.ca/city-government/data-research-maps/open-data/open-data-licence/)

If you redistribute or modify this app, please keep:
- The MIT license text
- Leaflet attribution
- OpenStreetMap attribution
- Data source attribution (City of Toronto)
- Add a NOTICE file summarizing any third-party licenses.