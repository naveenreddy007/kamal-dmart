import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
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
  IonBadge,
  IonCard,
  IonCardContent,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonButtons,
  IonBackButton,
  IonAlert,
  IonToast,
  IonItemSliding,
  IonItemOptions,
  IonItemOption
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  notificationsOutline,
  checkmarkOutline,
  trashOutline,
  receiptOutline,
  pricetagOutline,
  flashOutline,
  informationCircleOutline,
  ellipsisVertical
} from 'ionicons/icons';
import { NotificationsService, Notification } from '../services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonBadge,

    IonRefresher,
    IonRefresherContent,
    IonSegment,
    IonSegmentButton,
    IonButtons,
    IonBackButton,
    IonAlert,
    IonToast,
    IonItemSliding,
    IonItemOptions,
    IonItemOption
  ],
})
export class NotificationsPage implements OnInit {
  handleClearCancel() {
    this.showClearAlert = false;
  }

  handleClearConfirm() {
    this.confirmClearAll();
  }
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  selectedFilter = 'all';
  unreadCount = 0;
  showClearAlert = false;
  showToast = false;
  toastMessage = '';

  clearAllButtons = [
    { text: 'Cancel', role: 'cancel', handler: () => { this.showClearAlert = false; } },
    { text: 'Clear All', role: 'destructive', handler: () => this.confirmClearAll() }
  ];

  filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'order', label: 'Orders' },
    { value: 'offer', label: 'Offers' }
  ];

  constructor(
    private notificationsService: NotificationsService,
    private router: Router
  ) {
    addIcons({
      notificationsOutline,
      checkmarkOutline,
      trashOutline,
      receiptOutline,
      pricetagOutline,
      flashOutline,
      informationCircleOutline,
      ellipsisVertical
    });
  }

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.notificationsService.getNotifications().subscribe(notifications => {
      this.notifications = notifications;
      this.unreadCount = this.notificationsService.getUnreadCount();
      this.filterNotifications();
    });
  }

  filterNotifications() {
    switch (this.selectedFilter) {
      case 'unread':
        this.filteredNotifications = this.notifications.filter(n => !n.read);
        break;
      case 'order':
        this.filteredNotifications = this.notifications.filter(n => n.type === 'order');
        break;
      case 'offer':
        this.filteredNotifications = this.notifications.filter(n => n.type === 'offer' || n.type === 'promotion');
        break;
      default:
        this.filteredNotifications = [...this.notifications];
    }
  }

  onFilterChange(event: any) {
    this.selectedFilter = event.detail.value;
    this.filterNotifications();
  }

  doRefresh(event: any) {
    // Simulate loading new notifications
    setTimeout(() => {
      this.loadNotifications();
      event.target.complete();
    }, 1000);
  }

  onNotificationClick(notification: Notification) {
    // Mark as read if not already read
    if (!notification.read) {
      this.notificationsService.markAsRead(notification.id);
    }

    // Navigate to action URL if available
    if (notification.actionUrl) {
      this.router.navigate([notification.actionUrl]);
    }
  }

  markAsRead(notification: Notification, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    
    this.notificationsService.markAsRead(notification.id);
    this.showToastMessage('Notification marked as read');
  }

  deleteNotification(notification: Notification, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    
    this.notificationsService.deleteNotification(notification.id);
    this.showToastMessage('Notification deleted');
  }

  markAllAsRead() {
    this.notificationsService.markAllAsRead();
    this.showToastMessage('All notifications marked as read');
  }

  clearAllNotifications() {
    this.showClearAlert = true;
  }

  confirmClearAll() {
    this.notificationsService.clearAllNotifications();
    this.showToastMessage('All notifications cleared');
    this.showClearAlert = false;
  }

  getNotificationIcon(type: Notification['type']): string {
    return this.notificationsService.getNotificationIcon(type);
  }

  getNotificationColor(type: Notification['type']): string {
    return this.notificationsService.getNotificationColor(type);
  }

  formatTimestamp(timestamp: Date): string {
    return this.notificationsService.formatTimestamp(timestamp);
  }

  showToastMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;
  }

  trackByNotificationId(index: number, notification: Notification): string {
    return notification.id;
  }
}