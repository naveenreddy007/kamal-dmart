import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonItem, IonLabel, IonList, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { locationOutline, timeOutline, pricetagOutline } from 'ionicons/icons';
import { LocationService } from '../services/location.service';
import { CommonModule } from '@angular/common';
import { InrCurrencyPipe } from '../pipes/inr-currency.pipe';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  originalPrice: number;
  discountedPrice: number;
  validUntil: string;
  distance: number;
  category: string;
  imageUrl?: string;
  storeName: string;
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
    IonList,
    IonRefresher,
    IonRefresherContent,
    InrCurrencyPipe
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
        lat: position.latitude,
        lng: position.longitude
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
        title: 'Biryani Bonanza',
        description: 'Hyderabadi biryani pe 40% off - finger licking good!',
        discount: '40% OFF',
        originalPrice: 499,
        discountedPrice: 299,
        validUntil: '31 Dec 2024',
        distance: 0.3,
        category: 'Food',
        storeName: 'Paradise Biryani',
        imageUrl: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop'
      },
      {
        id: '2',
        title: 'Chai Pe Charcha',
        description: '2 cutting chai + samosa combo sirf ₹50 mein',
        discount: 'COMBO DEAL',
        originalPrice: 80,
        discountedPrice: 50,
        validUntil: '25 Dec 2024',
        distance: 0.2,
        category: 'Beverages',
        storeName: 'Tapri Chai',
        imageUrl: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop'
      },
      {
        id: '3',
        title: 'Kurta Collection Sale',
        description: 'Festive kurtas pe upto 60% off - ethnic wear ka mela!',
        discount: '60% OFF',
        originalPrice: 1999,
        discountedPrice: 799,
        validUntil: '20 Dec 2024',
        distance: 0.8,
        category: 'Fashion',
        storeName: 'Manyavar',
        imageUrl: 'https://images.unsplash.com/photo-1622470952794-aa9c70b0fb9d?w=400&h=300&fit=crop'
      },
      {
        id: '4',
        title: 'Mobile Accessories Mela',
        description: 'Phone covers, earphones aur chargers pe heavy discount',
        discount: '50% OFF',
        originalPrice: 599,
        discountedPrice: 299,
        validUntil: '28 Dec 2024',
        distance: 1.1,
        category: 'Electronics',
        storeName: 'Mobile Zone',
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop'
      },
      {
        id: '5',
        title: 'Sweets Ka Tyohar',
        description: 'Gulab jamun, rasgulla aur laddu - mithai box ₹199 mein',
        discount: 'SPECIAL PRICE',
        originalPrice: 350,
        discountedPrice: 199,
        validUntil: '30 Dec 2024',
        distance: 0.6,
        category: 'Sweets',
        storeName: 'Haldiram\'s',
        imageUrl: 'https://images.unsplash.com/photo-1606471191009-63d7c9c4b8e4?w=400&h=300&fit=crop'
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
    console.log('Offer claim kar rahe hain:', offer);
    // Implement offer claiming logic
    // Show success message: "Offer successfully claim ho gaya!"
  }

  getDistanceText(distance: number): string {
    return distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`;
  }
}