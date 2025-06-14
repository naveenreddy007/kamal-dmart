import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  addresses: Address[];
  preferences: UserPreferences;
  membershipLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  joinDate: Date;
  totalOrders: number;
  totalSpent: number;
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface UserPreferences {
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
    orderUpdates: boolean;
    promotions: boolean;
    newOffers: boolean;
  };
  privacy: {
    shareLocation: boolean;
    shareOrderHistory: boolean;
    allowAnalytics: boolean;
  };
  app: {
    theme: 'auto' | 'light' | 'dark';
    language: string;
    currency: string;
    autoLogin: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private currentUser = new BehaviorSubject<UserProfile | null>(null);
  public currentUser$ = this.currentUser.asObservable();

  private mockUser: UserProfile = {
    id: 'user-123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'assets/avatars/default-avatar.svg',
    dateOfBirth: new Date('1990-05-15'),
    gender: 'male',
    addresses: [
      {
        id: 'addr-1',
        type: 'home',
        label: 'Home',
        street: '123 Main Street, Apt 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
        isDefault: true,
        coordinates: {
          latitude: 40.7128,
          longitude: -74.0060
        }
      },
      {
        id: 'addr-2',
        type: 'work',
        label: 'Office',
        street: '456 Business Ave, Suite 200',
        city: 'New York',
        state: 'NY',
        zipCode: '10002',
        country: 'United States',
        isDefault: false,
        coordinates: {
          latitude: 40.7589,
          longitude: -73.9851
        }
      }
    ],
    preferences: {
      notifications: {
        push: true,
        email: true,
        sms: false,
        orderUpdates: true,
        promotions: true,
        newOffers: true
      },
      privacy: {
        shareLocation: true,
        shareOrderHistory: false,
        allowAnalytics: true
      },
      app: {
        theme: 'auto',
        language: 'en',
        currency: 'USD',
        autoLogin: true
      }
    },
    membershipLevel: 'gold',
    joinDate: new Date('2023-01-15'),
    totalOrders: 47,
    totalSpent: 1247.89
  };

  constructor() {
    // Simulate loading user data
    this.currentUser.next(this.mockUser);
  }

  getCurrentUser(): Observable<UserProfile | null> {
    return this.currentUser.asObservable();
  }

  updateProfile(updates: Partial<UserProfile>): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUser = this.currentUser.value;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates };
          this.currentUser.next(updatedUser);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  }

  updatePreferences(preferences: Partial<UserPreferences>): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUser = this.currentUser.value;
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            preferences: { ...currentUser.preferences, ...preferences }
          };
          this.currentUser.next(updatedUser);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  }

  addAddress(address: Omit<Address, 'id'>): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUser = this.currentUser.value;
        if (currentUser) {
          const newAddress: Address = {
            ...address,
            id: `addr-${Date.now()}`
          };
          
          // If this is set as default, remove default from others
          if (newAddress.isDefault) {
            currentUser.addresses.forEach(addr => addr.isDefault = false);
          }
          
          const updatedUser = {
            ...currentUser,
            addresses: [...currentUser.addresses, newAddress]
          };
          this.currentUser.next(updatedUser);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  }

  updateAddress(addressId: string, updates: Partial<Address>): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUser = this.currentUser.value;
        if (currentUser) {
          const addressIndex = currentUser.addresses.findIndex(addr => addr.id === addressId);
          if (addressIndex !== -1) {
            // If setting as default, remove default from others
            if (updates.isDefault) {
              currentUser.addresses.forEach(addr => addr.isDefault = false);
            }
            
            currentUser.addresses[addressIndex] = {
              ...currentUser.addresses[addressIndex],
              ...updates
            };
            
            this.currentUser.next({ ...currentUser });
            resolve(true);
          } else {
            resolve(false);
          }
        } else {
          resolve(false);
        }
      }, 1000);
    });
  }

  deleteAddress(addressId: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUser = this.currentUser.value;
        if (currentUser) {
          const updatedAddresses = currentUser.addresses.filter(addr => addr.id !== addressId);
          
          // If we deleted the default address, make the first one default
          if (updatedAddresses.length > 0 && !updatedAddresses.some(addr => addr.isDefault)) {
            updatedAddresses[0].isDefault = true;
          }
          
          const updatedUser = {
            ...currentUser,
            addresses: updatedAddresses
          };
          this.currentUser.next(updatedUser);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  }

  getDefaultAddress(): Address | null {
    const currentUser = this.currentUser.value;
    if (currentUser) {
      return currentUser.addresses.find(addr => addr.isDefault) || null;
    }
    return null;
  }

  getMembershipBenefits(level: UserProfile['membershipLevel']): string[] {
    const benefits = {
      bronze: [
        'Free delivery on orders over $25',
        'Basic customer support',
        'Order tracking'
      ],
      silver: [
        'Free delivery on orders over $15',
        'Priority customer support',
        'Order tracking',
        '5% cashback on orders',
        'Early access to sales'
      ],
      gold: [
        'Free delivery on all orders',
        'Premium customer support',
        'Order tracking',
        '10% cashback on orders',
        'Early access to sales',
        'Exclusive offers',
        'Birthday rewards'
      ],
      platinum: [
        'Free delivery on all orders',
        'VIP customer support',
        'Order tracking',
        '15% cashback on orders',
        'Early access to sales',
        'Exclusive offers',
        'Birthday rewards',
        'Personal shopping assistant',
        'Free returns'
      ]
    };
    
    return benefits[level] || [];
  }

  getMembershipColor(level: UserProfile['membershipLevel']): string {
    const colors = {
      bronze: '#CD7F32',
      silver: '#C0C0C0',
      gold: '#FFD700',
      platinum: '#E5E4E2'
    };
    
    return colors[level] || '#CD7F32';
  }

  formatCurrency(amount: number): string {
    const currentUser = this.currentUser.value;
    const currency = currentUser?.preferences.app.currency || 'USD';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  logout(): void {
    this.currentUser.next(null);
  }
}