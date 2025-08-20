# UX updates

- For Figma see [This YouTube Video](https://www.youtube.com/watch?v=EoD4ThC-ECI)

- Add features via fly-out menus
- Activate other Leaflet map features, such as trails etc. 
- Users can customize notifications - how many times they occur
- Users can customize proximity
- Driving Data & History: would require data storage.
- Trip Recording: Log trips, including speed, routes, and camera encounters.
- If data storage is implemented then it would need a Privacy Statement. All data stays local or anonymized (no GPS tracking sent to servers).

- The Alert can be closed or muted
- Statistics Dashboard: Provide insights (e.g., average speed, top speeding zones, alert frequency).

- Camera info should show speed limit at its location

- Simplify the layout.
- For UI and layout refer to City of Toronto Waste Collection App called [Waste Wizard](https://www.toronto.ca/services-payments/recycling-organics-garbage/waste-wizard/). 
- It's available on Google Play and Apple Store
- Screen UI is [here](https://play.google.com/store/apps/details?id=ca.toronto.torontowastewizard&hl=en_CA)
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
Implement AI Chatbot                            


### Core Leaflet (built-in, no plugins)

- Proximity radius ring threshold around the user.
- Direction-Awareness. Only alert if you're driving toward a speed camera, not just nearby.

### Plugins

- Marker clustering can be implemented with a Leaflet Plugin: Leaflet.markercluster which swaps `L.layerGroup` of markers for a cluster group

- Search implementation to find an address or intersection can also be done with a Leaflet Plugin: Leaflet Control Geocoder `L.Control.geocoder().addTo(map)`