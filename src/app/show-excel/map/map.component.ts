import { Component, ElementRef, OnInit,AfterViewInit, ViewChild } from '@angular/core';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import Tile from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import { fromLonLat } from 'ol/proj.js';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit{
map!:Map
 ngOnInit(): void {
this.createMap()
 }
  createMap(){
    this.map=new Map({
    target: 'map',
    layers: [
      new Tile({
        source: new OSM(),
      }),
    ],
    view: new View({
      center: fromLonLat([38.21, 32.32]),
      zoom: 2,
    }),
  });
}
}
