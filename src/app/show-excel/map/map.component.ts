import { Component, ElementRef, OnChanges,AfterViewInit, ViewChild, Input, OnInit, SimpleChanges } from '@angular/core';
// import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { OSM } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { LineString } from 'ol/geom';
import { Style, Stroke } from 'ol/style';
import WKT from 'ol/format/WKT';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnChanges{
  public map!: Map
  @Input() coordinates!:any
private destroyMap(): void {
  if (this.map) {
    this.map.setTarget(); // Remove the map from the DOM
    this.map.dispose(); // Dispose of the map to release resources
  }
}
createMap(){
 
debugger
  // Parse the LINESTRING coordinates from WKT
  const wktString =this.coordinates;
  const wktFormat = new WKT();
  const feature = wktFormat.readFeature(wktString);
  const coordinates = wktString
  .replace('LINESTRING(', '')
  .replace(')', '')
  .split(',')
  .map((coord:any) => coord.trim().split(' ').map(parseFloat));

    // Calculate the center of the bounding box
    const minX = Math.min(...coordinates.map((coord:any) => coord[0]));
    const minY = Math.min(...coordinates.map((coord:any) => coord[1]));
    const maxX = Math.max(...coordinates.map((coord:any) => coord[0]));
    const maxY = Math.max(...coordinates.map((coord:any) => coord[1]));
    const centerLon = (minX + maxX) / 2;
    const centerLat = (minY + maxY) / 2;
    const centerCoordinates = fromLonLat([centerLon, centerLat]);


  // Create a vector layer and add the parsed feature
  this.map = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View({
      center:centerCoordinates,
      zoom: 4,
    }),
  });
  
  const lineStringFeature = new Feature({
    geometry: coordinates,
  });
  lineStringFeature.setStyle(
    new Style({
      stroke: new Stroke({
        color: 'red', // line color
        width: 3, // line height
      }),
    })
  );
  const vectorLayer = new VectorLayer({
    source: new VectorSource({
      features: [feature],
    }),
  });

  // Add the vector layer to the map
  this.map.addLayer(vectorLayer);
}


  ngOnChanges(changes: SimpleChanges): void {
    //when i change location
    if(changes['coordinates'].currentValue!==changes['coordinates'].previousValue){
      this.destroyMap();
      this.createMap();
    }
 
  }
}



