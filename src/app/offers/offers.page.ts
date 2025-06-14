import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonItem, IonLabel, IonList, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { locationOutline, timeOutline, pricetagOutline } from 'ionicons/icons';
import { LocationService } from '../services/location.service';
import { CommonModule } from '@angular/common';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  distance: number;
  category: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonRefresher,
    IonRefresherContent
  ]
})
export class OffersPage implements OnInit {
  offers: Offer[] = [];
  loading = false;
  userLocation: { lat: number; lng: number } | null = null;

  constructor(private locationService: LocationService) {
    addIcons({ locationOutline, timeOutline, pricetagOutline });
  }

  ngOnInit() {
    this.loadUserLocation();
    this.loadOffers();
  }

  async loadUserLocation() {
    try {
      const position = await this.locationService.getCurrentLocation();
      this.userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
    } catch (error) {
      console.error('Error getting location:', error);
    }
  }

  loadOffers() {
    // Mock data - replace with actual API call
    this.offers = [
      {
        id: '1',
        title: 'Pizza Palace Special',
        description: 'Get 30% off on all large pizzas',
        discount: '30% OFF',
        validUntil: '2024-12-31',
        distance: 0.5,
        category: 'Food',
        imageUrl: 'assets/pizza.jpg'
      },
      {
        id: '2',
        title: 'Coffee Corner Deal',
        description: 'Buy 2 get 1 free on all beverages',
        discount: 'Buy 2 Get 1',
        validUntil: '2024-12-25',
        distance: 0.8,
        category: 'Beverages'
      },
      {
        id: '3',
        title: 'Fashion Store Sale',
        description: 'Up to 50% off on winter collection',
        discount: '50% OFF',
        validUntil: '2024-12-20',
        distance: 1.2,
        category: 'Fashion'
      }
    ];
  }

  doRefresh(event: any) {
    this.loadOffers();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  claimOffer(offer: Offer) {
    console.log('Claiming offer:', offer);
    // Implement offer claiming logic
  }

  getDistanceText(distance: number): string {
    return distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`;
  }
}