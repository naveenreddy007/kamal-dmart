import { Injectable } from '@angular/core';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Platform } from '@ionic/angular';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
  address?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private watchId: any;
  private currentLocation: LocationData | null = null;

  constructor(
    private geolocation: Geolocation,
    private platform: Platform
  ) { }

  async getCurrentLocation(): Promise<LocationData> {
    try {
      const position = await this.geolocation.getCurrentPosition();
      this.currentLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      };
      return this.currentLocation;
    } catch (error) {
      console.error('Error getting location', error);
      throw error;
    }
  }

  startWatchingLocation(callback: (location: LocationData) => void): void {
    this.watchId = this.geolocation.watchPosition().subscribe(
      (position) => {
        this.currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };
        callback(this.currentLocation);
      },
      (error) => console.error('Error watching location', error)
    );
  }

  stopWatchingLocation(): void {
    if (this.watchId) {
      this.watchId.unsubscribe();
    }
  }

  getLastKnownLocation(): LocationData | null {
    return this.currentLocation;
  }
}