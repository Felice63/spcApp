# SpeedCarma PWA

This simple Progressive Web App is a work in progress built with Vanilla Web technologies. It uses [LeafletJS](https://leafletjs.com/), [OpenStreetMap](https://www.openstreetmap.org/), and the [City of Toronto public datasets](https://www.toronto.ca/city-government/data-research-maps/open-data/).

## Leaflet

Leaflet is a free, open-source JavaScript library for creating interactive maps. It provides the map interface and functionality. To display a map, you need to use a tile provider.

Map tile providers may have their own terms of service and pricing. This Web App uses OpenStreetMap. Other providers like [Mapbox](https://www.mapbox.com/) or [Esri](https://www.esri.com/en-us/home) offer free tiers but may charge for high usage.

## OpenStreetMap

OpenStreetMap (OSM) is a free, open-source online map and tile provider. Anyone can edit and contribute to the project by adding roads, buildings, parks, and other places. OSM is used in many apps, websites, and for geographic research.


## Public JSON data being fetched

This PWA uses [public facing JSON data](https://services3.arcgis.com/b9WvedVPoizGfvfD/ArcGIS/rest/services/COT_SPEED_CAMERAS/FeatureServer/0/query?where=1%3D1%20&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&token=&f=json) maintained and curated by the [City of Toronto](https://www.toronto.ca/city-government/data-research-maps/open-data/)

### Other CoT services

- [Can be found here](https://services3.arcgis.com/b9WvedVPoizGfvfD/ArcGIS/rest/services/)

### Feature Server Query form

- [Can be found here](https://services3.arcgis.com/b9WvedVPoizGfvfD/ArcGIS/rest/services/COT_SPEED_CAMERAS/FeatureServer/0/query)


### Map viewer

- [Can be found here](https://www.arcgis.com/apps/mapviewer/index.html?url=https://services3.arcgis.com/b9WvedVPoizGfvfD/ArcGIS/rest/services/COT_SPEED_CAMERAS/FeatureServer&source=sd)

### Other Data provided by CoT

- [Can be found here](https://services3.arcgis.com/b9WvedVPoizGfvfD/ArcGIS/rest/services/)

## Other Communitites in Ontario with Automated Speed Enforcement (ASE)

- [Link to ASE Ontario](https://www.aseontario.com/ase-communities)

- Brampton
- Durham Region
- Hamilton
- London
- Mississauga
- Ottawa
- Peel Region
- Pickering
- Waterloo
- York Region
- [Town of Newmarket](https://www.newmarket.ca/CommunitySafetyCameras)
    - https://experience.arcgis.com/experience/64cb688957ef4ef58bf6f716761a9ffc/


# Done

- The location alert notification can now be closed using the `popover api`.
- Added [Leaflet Control Geocoder](https://github.com/perliedman/leaflet-control-geocoder) for search functionality
- Added [Leaflet Routing Machine](https://www.liedman.net/leaflet-routing-machine/) plugin for route planning which is written by the same developer [Per Liedman](https://www.liedman.net/)
- Note that the plugin uses its own route server for demo purposes and will not function properly in production
- Acquired OpenRouteService (ORS) for route planning
- You will need your own API key from ORS. They have a free tier for low to medium calls
- Added `.env` file for local development to store the API key for local development
- When uploading to Github the `.env` will be  `.gitignored` 
- Added the ORS API key to vercel Environment Variables and deployed.

# To Do

- At some point have the end user choose to subscribe for updates via push notifications.
- Will need a DB for this. Turso can be used to store the user data.
- Update the UI to accept donations to keep the app updated and send a donation to Leaflet dev.
- Can also put info about the app developer.
- The Route Planner should accept street name inputs for starting and ending points
- The ability to save routes could be implemented
- Users can customize notifications - how many times they occur
- Users can customize proximity of speed cameras
- Should include a Privacy Statement about all data staying local or anonymized (no GPS tracking sent to servers).

- Statistics Dashboard: Provide insights (e.g., average speed, top speeding zones, alert frequency).
- Camera info should show speed limit at its location
- Use Cascade Layers to better manage CSS specificity
- Consider making the UI less like a website and more like a WEB APP

### Settings for app behavior, alerts, and privacy.

- Alert Settings:                                 
Customize Distance
Voice Alerts on or off
Alert Type: Visual only Audio only, both visual and audio                

- Help & Support                                
Sync Data
App Version       
Implement AI Chatbot                            

### Core Leaflet (built-in, no plugins)

- Proximity radius ring threshold around the user.
- Direction-Awareness. Only alert if you're driving toward a speed camera, not just nearby.

### Plugins

- Marker clustering can be implemented with a Leaflet Plugin: Leaflet.markercluster which swaps `L.layerGroup` of markers for a cluster group


## Local Development & Running the ORS Proxy

1. **Add your own ORS API key to a `.env` file in the project root:**

    ```
    ORS_API_KEY=your-actual-ors-api-key-here
    ```

2. **Install backend dependencies:**

    ```
    npm install express axios cors dotenv
    ```

3. **Start the local proxy server:**

    ```
    node server.js
    ```

4. **Start your frontend (e.g., with Live Server or similar):**

    - Open `index.html` in your browser, or use a local server.

5. **The app will automatically use the local proxy for routing when running on localhost.**

6. **For production, deploy to Vercel and set the `ORS_API_KEY` as an environment variable in your Vercel PRODUCTION settings.**

To update packages:

`npm update`


Upgrade dependencies to their latest versions:

`
npm install -g npm-check-updates
ncu -u
npm install
`