import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { RouterLink, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { storefront, pricetag, cart, locationOutline } from 'ionicons/icons';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonIcon, RouterLink],
  providers: [Geolocation]
})
export class Tab1Page implements OnInit {
  currentLocation: string = 'Detecting location...';
  
  constructor(
    private router: Router,
    private geolocation: Geolocation,
    private platform: Platform
  ) {
    addIcons({ storefront, pricetag, cart, locationOutline });
  }

  ngOnInit() {
    this.getCurrentLocation();
  }

  async getCurrentLocation() {
    try {
      if (this.platform.is('cordova')) {
        const position = await this.geolocation.getCurrentPosition();
        // In a real app, you would use reverse geocoding to get city/pincode
        // For demo purposes, we'll show coordinates
        this.currentLocation = `Lat: ${position.coords.latitude.toFixed(2)}, Lng: ${position.coords.longitude.toFixed(2)}`;
      } else {
        // Fallback for browser testing
        this.currentLocation = 'Mumbai, 400001';
      }
    } catch (error) {
      console.error('Error getting location:', error);
      this.currentLocation = 'Location unavailable';
    }
  }

  navigateToCategory(category: string) {
    this.router.navigate(['/tabs/products'], { 
      queryParams: { category: category } 
    });
  }
}
