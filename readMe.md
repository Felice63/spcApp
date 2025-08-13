### SpeedCarma PWA

This simple Progressive Web App is a work in progress built with Vanilla Web technologies. It uses [LeafletJS](https://leafletjs.com/), [OpenStreetMap](https://www.openstreetmap.org/), and the [City of Toronto public datasets](https://www.toronto.ca/city-government/data-research-maps/open-data/).

### Leaflet

Leaflet is a free, open-source JavaScript library for creating interactive maps. It provides the map interface and functionality. To display a map, you need to use a tile provider.

Map tile providers may have their own terms of service and pricing. This Web App uses OpenStreetMap. Other providers like [Mapbox](https://www.mapbox.com/) or [Esri](https://www.esri.com/en-us/home) offer free tiers but may charge for high usage.

### OpenStreetMap

OpenStreetMap (OSM) is a free, open-source online map and tile provider. Anyone can edit and contribute to the project by adding roads, buildings, parks, and other places. OSM is used in many apps, websites, and for geographic research.


### Public JSON data being fetched

This PWA uses [public facing JSON data](https://services3.arcgis.com/b9WvedVPoizGfvfD/ArcGIS/rest/services/COT_SPEED_CAMERAS/FeatureServer/0/query?where=1%3D1%20&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&token=&f=json) maintained and curated by the [City of Toronto](https://www.toronto.ca/city-government/data-research-maps/open-data/)

### Feature Server Query form

[Can be found here](https://services3.arcgis.com/b9WvedVPoizGfvfD/ArcGIS/rest/services/COT_SPEED_CAMERAS/FeatureServer/0/query)


### Map viewer

[Can be found here](https://www.arcgis.com/apps/mapviewer/index.html?url=https://services3.arcgis.com/b9WvedVPoizGfvfD/ArcGIS/rest/services/COT_SPEED_CAMERAS/FeatureServer&source=sd)

### Other Data provided by CoT

[Can be found here](https://services3.arcgis.com/b9WvedVPoizGfvfD/ArcGIS/rest/services/)


### To Do

- Add features via a drop-down or fly-out menu
- Activate other Leaflet map features, such as trails etc. 
- Users can customize the notifications - how many times they occur
- Users can customize proximity
- Driving Data & History: would require data storage.
- Trip Recording: Log trips, including speed, routes, and camera encounters.
- If data storage is implemented then it would need a Privacy Statement. All data stays local or anonymized (no GPS tracking sent to servers).

- The Alert can be closed or muted
- Statistics Dashboard: Provide insights (e.g., average speed, top speeding zones, alert frequency).

- Camera info should show speed limit at its location

### UX updates

- Simplify the layout.
- For UI and layout refer to City of Toronto Waste Collection App called [Waste Wizard](https://www.toronto.ca/services-payments/recycling-organics-garbage/waste-wizard/). It's available on Google Play and Apple Store
- Use Cascade Layers to better manage CSS specificity
- Move controls so they do not overlap footer credits.
- Consider making the UI less like a website and more like a WEB APP
- Remove Big Hero Header Banner and Footer with all the credits
- Refer to APPS and their UI. Link icons in the footer, settings etc

### Settings for app behavior, alerts, and privacy.

- Alert Settings:                                 
Customize Distance
Voice Alerts on or off
Alert Type: Visual only Audio only, both visual and audio

- Privacy Settings                              
Save trip history: On                        
Share reports anonymously                    

- Help & Support                                
Sync Data
App Version                                   


### Core Leaflet (built-in, no plugins)

- Proximity radius ring threshold around the user.
- Direction-Awareness. Only alert if you're driving toward a speed camera, not just nearby.

### Plugins

- Marker clustering can be implemented with a Leaflet Plugin: Leaflet.markercluster which swaps `L.layerGroup` of markers for a cluster group

- Search implementation to find an address or intersection can also be done with a Leaflet Plugin: Leaflet Control Geocoder `L.Control.geocoder().addTo(map)`


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