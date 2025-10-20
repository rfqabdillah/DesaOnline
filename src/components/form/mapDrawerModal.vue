<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h5 class="modal-title">Pilih / Gambar Lokasi di Peta</h5>
        <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
      </div>

      <div class="modal-body grid-container">
        <div class="map-container">
          <l-map
            ref="map"
            style="height: 100%; width: 100%"
            :zoom="zoom"
            :center="center"
            @ready="onMapReady"
          >
            <l-tile-layer :url="url" :attribution="attribution" />
          </l-map>
        </div>
        
        <div class="geojson-container">
          <label class="form-label fw-bold mb-2">Hasil GeoJSON</label>
          <textarea
            class="form-control"
            v-model="geojsonData"
            rows="20"
            readonly
          ></textarea>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="closeModal">Batal</button>
        <button class="btn btn-primary" @click="saveGeoJSON">Simpan Koordinat</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;


const props = defineProps({
  initialGeoJSON: { type: String, default: "" },
});

const emit = defineEmits(["close", "save"]);

const zoom = ref(5);
const center = ref([-2.5489, 118.0149]);
const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
const geojsonData = ref("");

let drawnItems;
let mapInstance;

const onMapReady = (map) => {
  mapInstance = map;
  drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);

  const drawControl = new L.Control.Draw({
    draw: {
      polyline: false,
      polygon: true,
      rectangle: false,
      circle: false,
      marker: false,
      circlemarker: false,
    },
    edit: {
      featureGroup: drawnItems,
      remove: true,
    },
  });
  map.addControl(drawControl);

  if (props.initialGeoJSON) {
    try {
      const data = JSON.parse(props.initialGeoJSON);
      L.geoJSON(data).eachLayer((layer) => drawnItems.addLayer(layer));
      if (drawnItems.getLayers().length > 0) {
        map.fitBounds(drawnItems.getBounds());
      }
      updateGeoJSON();
    } catch (e) {
      console.warn("Invalid initial GeoJSON:", e);
    }
  }

  map.on(L.Draw.Event.CREATED, (e) => {
    drawnItems.addLayer(e.layer);
    updateGeoJSON();
  });

  map.on(L.Draw.Event.EDITED, updateGeoJSON);

  map.on(L.Draw.Event.DELETED, () => {
    updateGeoJSON();
    if (drawnItems.getLayers().length === 0) {
      geojsonData.value = "";
    }
  });

  map.invalidateSize();
};

watch(
  () => props.initialGeoJSON,
  (newGeoJSON) => {
    if (mapInstance && drawnItems) {
      drawnItems.clearLayers();
      if (newGeoJSON) {
        try {
          const data = JSON.parse(newGeoJSON);
          L.geoJSON(data).eachLayer((layer) => drawnItems.addLayer(layer));
          if (drawnItems.getLayers().length > 0) {
            mapInstance.fitBounds(drawnItems.getBounds());
          }
          updateGeoJSON();
        } catch (e) {
          console.warn("Invalid GeoJSON on update:", e);
        }
      } else {
        geojsonData.value = "";
      }
    }
  }
);

function updateGeoJSON() {
  const data = drawnItems.toGeoJSON();
  geojsonData.value = JSON.stringify(data, null, 1)
    .replace(/],\s*\[/g, "], [") 
    .replace(/\n\s{4,}/g, " "); 
}

function closeModal() {
  emit("close");
}

function saveGeoJSON() {
  emit("save", geojsonData.value);
  closeModal();
}

function handleOverlayClick(e) {
  if (e.target === e.currentTarget) closeModal();
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  border-radius: 10px;
  width: 95%; 
  max-width: 1300px;
  max-height: 95vh;
  display: flex;
  flex-direction: column;
}

.modal-header,
.modal-footer {
  padding: 1rem;
  flex-shrink: 0;
}

.modal-header {
  border-bottom: 1px solid #dee2e6;
}

.modal-footer { 
  border-top: 1px solid #dee2e6; display: flex; 
  justify-content: flex-end; gap: 0.5rem; 
}

.modal-body {
  flex-grow: 1;
  overflow: hidden;
  padding: 1rem;
}

.grid-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  height: 100%;
}

.map-container {
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.geojson-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.geojson-container textarea {
  flex-grow: 1;
  resize: none;
  font-family: monospace;
}
</style>
