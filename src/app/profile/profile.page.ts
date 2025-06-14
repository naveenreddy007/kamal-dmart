import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonBadge,
  IonRefresher,
  IonRefresherContent,
  IonButtons,
  IonBackButton,
  IonToast,
  IonActionSheet,
  IonAlert,
  IonToggle,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonTextarea,
  IonModal,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  settingsOutline,
  locationOutline,
  notificationsOutline,
  shieldOutline,
  logOutOutline,
  exitOutline,
  addOutline,
  trashOutline,
  starOutline,
  giftOutline,
  cardOutline,
  helpCircleOutline,
  informationCircleOutline,
  chevronForwardOutline,
  cameraOutline
} from 'ionicons/icons';
import { ProfileService, UserProfile, Address } from '../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonAvatar,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonBadge,
    IonRefresher,
    IonRefresherContent,
    IonButtons,
    IonBackButton,
    IonToast,
    IonActionSheet,
    IonAlert,
    IonToggle,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonTextarea,
    IonModal,
    IonGrid,
    IonRow,
    IonCol
  ]
})
export class ProfilePage implements OnInit {
  user: any = { addresses: [] };
  showToast = false;
  toastMessage = '';
  showActionSheet = false;
  showLogoutAlert = false;
  showEditModal = false;
  showAddressModal = false;
  editingAddress: Address | null = null;
  
  editForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: ''
  };

  addressForm = {
    type: 'home' as 'home' | 'work' | 'other',
    label: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    isDefault: false
  };

  menuItems = [
    {
      icon: 'person-outline',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      action: 'editProfile'
    },
    {
      icon: 'location-outline',
      title: 'Addresses',
      subtitle: 'Manage delivery addresses',
      action: 'manageAddresses'
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      subtitle: 'Notification preferences',
      action: 'notifications'
    },
    {
      icon: 'shield-outline',
      title: 'Privacy & Security',
      subtitle: 'Privacy settings and security',
      action: 'privacy'
    },
    {
      icon: 'card-outline',
      title: 'Payment Methods',
      subtitle: 'Manage payment options',
      action: 'payment'
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      action: 'help'
    },
    {
      icon: 'information-circle-outline',
      title: 'About',
      subtitle: 'App version and legal info',
      action: 'about'
    }
  ];

  constructor(
    private profileService: ProfileService,
    private router: Router
  ) {
    addIcons({
      personOutline,
      settingsOutline,
      locationOutline,
      notificationsOutline,
      shieldOutline,
      logOutOutline,
      exitOutline,
      addOutline,
      trashOutline,
      starOutline,
      giftOutline,
      cardOutline,
      helpCircleOutline,
      informationCircleOutline,
      chevronForwardOutline,
      cameraOutline
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.profileService.getCurrentUser().subscribe(user => {
      this.user = user;
      if (user) {
        this.editForm = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().split('T')[0] : '',
          gender: user.gender || ''
        };
      }
    });
  }

  doRefresh(event: any) {
    setTimeout(() => {
      this.loadProfile();
      event.target.complete();
    }, 1000);
  }

  onMenuItemClick(action: string) {
    switch (action) {
      case 'editProfile':
        this.showEditModal = true;
        break;
      case 'manageAddresses':
        // Navigate to addresses page or show address management
        this.showAddressModal = true;
        break;
      case 'notifications':
        this.router.navigate(['/tabs/notifications']);
        break;
      case 'privacy':
        this.showToastMessage('Privacy settings coming soon');
        break;
      case 'payment':
        this.showToastMessage('Payment methods coming soon');
        break;
      case 'help':
        this.showToastMessage('Help & Support coming soon');
        break;
      case 'about':
        this.showToastMessage('About page coming soon');
        break;
    }
  }

  async saveProfile() {
    if (!this.user) return;

    const updates = {
      firstName: this.editForm.firstName,
      lastName: this.editForm.lastName,
      email: this.editForm.email,
      phone: this.editForm.phone,
      dateOfBirth: this.editForm.dateOfBirth ? new Date(this.editForm.dateOfBirth) : undefined,
      gender: this.editForm.gender as 'male' | 'female' | 'other'
    };

    const success = await this.profileService.updateProfile(updates);
    if (success) {
      this.showEditModal = false;
      this.showToastMessage('Profile updated successfully');
    } else {
      this.showToastMessage('Failed to update profile');
    }
  }

  openAddressForm(address?: Address) {
    if (address) {
      this.editingAddress = address;
      this.addressForm = {
        type: address.type,
        label: address.label,
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        isDefault: address.isDefault
      };
    } else {
      this.editingAddress = null;
      this.addressForm = {
        type: 'home',
        label: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
        isDefault: false
      };
    }
    this.showAddressModal = true;
  }

  async saveAddress() {
    if (this.editingAddress) {
      // Update existing address
      const success = await this.profileService.updateAddress(this.editingAddress.id, this.addressForm);
      if (success) {
        this.showAddressModal = false;
        this.showToastMessage('Address updated successfully');
      } else {
        this.showToastMessage('Failed to update address');
      }
    } else {
      // Add new address
      const success = await this.profileService.addAddress(this.addressForm);
      if (success) {
        this.showAddressModal = false;
        this.showToastMessage('Address added successfully');
      } else {
        this.showToastMessage('Failed to add address');
      }
    }
  }

  async deleteAddress(address: Address) {
    const success = await this.profileService.deleteAddress(address.id);
    if (success) {
      this.showToastMessage('Address deleted successfully');
    } else {
      this.showToastMessage('Failed to delete address');
    }
  }

  changeAvatar() {
    this.showActionSheet = true;
  }

  onActionSheetDismiss(event: any) {
    const role = event.detail.role;
    if (role === 'camera') {
      this.showToastMessage('Camera feature coming soon');
    } else if (role === 'gallery') {
      this.showToastMessage('Gallery feature coming soon');
    }
    this.showActionSheet = false;
  }

  logout() {
    this.showLogoutAlert = true;
  }

  onLogoutAlertDismiss(event: any) {
    if (event.detail.role === 'destructive') {
      this.confirmLogout();
    }
    this.showLogoutAlert = false;
  }

  confirmLogout() {
    this.profileService.logout();
    this.router.navigate(['/login']);
  }

  getMembershipBenefits(): string[] {
    if (!this.user) return [];
    return this.profileService.getMembershipBenefits(this.user.membershipLevel);
  }

  getMembershipColor(): string {
    if (!this.user) return '#CD7F32';
    return this.profileService.getMembershipColor(this.user.membershipLevel);
  }

  formatCurrency(amount: number): string {
    return this.profileService.formatCurrency(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  }

  showToastMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;
  }
}