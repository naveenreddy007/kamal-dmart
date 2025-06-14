import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'offer' | 'system' | 'promotion';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notifications.asObservable();

  private mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'Order Delivered!',
      message: 'Your order #ORD-001 has been delivered successfully.',
      type: 'order',
      timestamp: new Date('2024-01-20T16:30:00'),
      read: false,
      actionUrl: '/tabs/orders'
    },
    {
      id: '2',
      title: 'New Offer Available!',
      message: 'Get 30% off on all coffee products. Limited time offer!',
      type: 'offer',
      timestamp: new Date('2024-01-20T10:15:00'),
      read: true,
      actionUrl: '/tabs/offers',
      imageUrl: 'assets/coffee-offer.jpg'
    },
    {
      id: '3',
      title: 'Order Confirmed',
      message: 'Your order #ORD-002 has been confirmed and is being prepared.',
      type: 'order',
      timestamp: new Date('2024-01-20T14:17:00'),
      read: false,
      actionUrl: '/tabs/orders'
    },
    {
      id: '4',
      title: 'Welcome to Our App!',
      message: 'Thank you for downloading our app. Enjoy exclusive deals and fast delivery!',
      type: 'system',
      timestamp: new Date('2024-01-15T09:00:00'),
      read: true
    },
    {
      id: '5',
      title: 'Flash Sale Alert!',
      message: 'Flash sale starting now! Up to 50% off on selected items.',
      type: 'promotion',
      timestamp: new Date('2024-01-19T12:00:00'),
      read: false,
      actionUrl: '/tabs/products'
    }
  ];

  constructor() {
    this.notifications.next(this.mockNotifications);
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  getUnreadCount(): number {
    return this.notifications.value.filter(n => !n.read).length;
  }

  markAsRead(notificationId: string): void {
    const notifications = this.notifications.value;
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notifications.next([...notifications]);
    }
  }

  markAllAsRead(): void {
    const notifications = this.notifications.value.map(n => ({ ...n, read: true }));
    this.notifications.next(notifications);
  }

  deleteNotification(notificationId: string): void {
    const notifications = this.notifications.value.filter(n => n.id !== notificationId);
    this.notifications.next(notifications);
  }

  clearAllNotifications(): void {
    this.notifications.next([]);
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    const notifications = [newNotification, ...this.notifications.value];
    this.notifications.next(notifications);
  }

  // Simulate receiving notifications
  simulateOrderNotification(orderId: string, status: string): void {
    let title = '';
    let message = '';
    
    switch (status) {
      case 'confirmed':
        title = 'Order Confirmed';
        message = `Your order ${orderId} has been confirmed and is being prepared.`;
        break;
      case 'preparing':
        title = 'Order Being Prepared';
        message = `Your order ${orderId} is now being prepared.`;
        break;
      case 'out_for_delivery':
        title = 'Order Out for Delivery';
        message = `Your order ${orderId} is out for delivery and will arrive soon.`;
        break;
      case 'delivered':
        title = 'Order Delivered!';
        message = `Your order ${orderId} has been delivered successfully.`;
        break;
      default:
        return;
    }

    this.addNotification({
      title,
      message,
      type: 'order',
      read: false,
      actionUrl: '/tabs/orders'
    });
  }

  simulateOfferNotification(offerTitle: string, discount: string): void {
    this.addNotification({
      title: 'New Offer Available!',
      message: `${offerTitle} - ${discount} off! Don't miss out!`,
      type: 'offer',
      read: false,
      actionUrl: '/tabs/offers'
    });
  }

  getNotificationIcon(type: Notification['type']): string {
    switch (type) {
      case 'order': return 'receipt-outline';
      case 'offer': return 'pricetag-outline';
      case 'promotion': return 'flash-outline';
      case 'system': return 'information-circle-outline';
      default: return 'notifications-outline';
    }
  }

  getNotificationColor(type: Notification['type']): string {
    switch (type) {
      case 'order': return 'primary';
      case 'offer': return 'success';
      case 'promotion': return 'warning';
      case 'system': return 'medium';
      default: return 'primary';
    }
  }

  formatTimestamp(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) {
      return 'Just now';
    } else if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(new Date(timestamp));
    }
  }

  // Request notification permissions (for real app)
  async requestPermissions(): Promise<boolean> {
    try {
      // In a real app, you would use Capacitor's Push Notifications plugin
      // For now, we'll simulate permission granted
      console.log('Notification permissions requested');
      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  // Register for push notifications (for real app)
  async registerForPushNotifications(): Promise<void> {
    try {
      // In a real app, you would register with FCM/APNS
      console.log('Registered for push notifications');
    } catch (error) {
      console.error('Error registering for push notifications:', error);
    }
  }
}