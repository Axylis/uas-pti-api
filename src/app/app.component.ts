import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';

import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import Bookmarks from '@arcgis/core/widgets/Bookmarks';
import Expand from '@arcgis/core/widgets/Expand';
import esriConfig from '@arcgis/core/config';
import Locate from '@arcgis/core/widgets/Locate';
import Search from '@arcgis/core/widgets/Search';
import Graphic from '@arcgis/core/Graphic';
import * as route from '@arcgis/core/rest/route';
import RouteParameters from '@arcgis/core/rest/support/RouteParameters';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'; 
import { map } from 'rxjs';
import BasemapToggle from '@arcgis/core/widgets/BasemapToggle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  public view: any = null;

  // The <div> where we will place the map
  @ViewChild('mapViewNode', { static: true }) private mapViewEl!: ElementRef;

  initializeMap(): Promise<any> {
    esriConfig.apiKey = 'AAPK1898551ba741484bace046f8d029259bF0UafznU_ZDxa1UVTsmoKflFe7xvquP_jXBIDea-BzLsQbiRn1D9SekOWLbCPVaC';
    const container = this.mapViewEl.nativeElement;

    const webmap = new WebMap({
      portalItem: {
        id: '204b1246c5bd4c99a64a16d1bfdae687',
      },
    });

    const view = new MapView({
      container,
      map: webmap
    });

    const bookmarks = new Bookmarks({
      view,
      // allows bookmarks to be added, edited, or deleted
      editingEnabled: true,
    });

    const bkExpand = new Expand({
      view,
      content: bookmarks,
      expanded: true,
    });

    const locate = new Locate({
      view: view,
      useHeadingEnabled: false,
      goToOverride: function(view, options){
        options.target.scale = 1500;
        return view.goTo(options.target);
      }
      });
    const search = new Search({  //Add Search widget
      view: view
    });

    const basemapToggle = new BasemapToggle({
      view: view,
      nextBasemap: "arcgis-imagery"
   });

   // Add widget to bottom-right corner of the view
   view.ui.add(basemapToggle,"bottom-right");

    // Add widget to top-left corner of the view
    view.ui.add(locate,"top-left");

    // Add the widget to the top-right corner of the view
    view.ui.add(bkExpand, 'top-right');

    view.ui.add(search, "top-right");
    // Add the widget to the top-right corner of the view

    webmap.when(() => {
      if (webmap.bookmarks && webmap.bookmarks.length) {
        console.log('Bookmarks: ', webmap.bookmarks.length);
      } else {
        console.log('No bookmarks in this webmap.');
      }
    });

    this.view = view;
    return this.view.when();
  }

  ngOnInit(): any {
    // Initialize MapView and return an instance of MapView
    this.initializeMap().then(() => {
      // The map has been initialized
        console.log('The map is ready.');
    });
  }

  ngOnDestroy(): void {
    if (this.view) {
      // destroy the map view
      this.view.destroy();
    }
  }
}
