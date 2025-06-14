import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationService } from '../services/location.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';

declare var google: any;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent],
})
export class Tab2Page implements AfterViewInit {
  @ViewChild('mapElement', { static: false }) mapElement!: ElementRef;
  @ViewChild(IonContent) content!: IonContent;
  
  currentLocation: any;
  private map: any;
  
  constructor(private locationService: LocationService) {}
  
  async ngAfterViewInit() {
    await this.loadGoogleMaps();
    this.initMap();
    this.startLocationTracking();
  }
  
  private async loadGoogleMaps() {
    // Google Maps API will be loaded here
  }
  
  private initMap() {
    // Map initialization will go here
  }
  
  private startLocationTracking() {
    this.locationService.startWatchingLocation((location) => {
      this.currentLocation = location;
      this.updateMapPosition();
    });
  }
  
  private updateMapPosition() {
    if (this.map && this.currentLocation) {
      // Update map position logic
    }
  }
  
  async centerMap() {
    try {
      this.currentLocation = await this.locationService.getCurrentLocation();
      this.updateMapPosition();
      this.content.scrollToTop();
    } catch (error) {
      console.error('Error centering map:', error);
    }
  }
}
