import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
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
  IonBadge,
  IonList,
  IonItem,
  IonLabel,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonSegment,
  IonSegmentButton,
  IonAlert,
  IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { timeOutline, locationOutline, cardOutline, closeCircleOutline, checkmarkCircleOutline, refreshOutline, receiptOutline } from 'ionicons/icons';
import { OrdersService, Order } from '../services/orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
    IonBadge,
    IonList,
    IonItem,
    IonLabel,
    IonRefresher,
    IonRefresherContent,
    IonSpinner,
    IonSegment,
    IonSegmentButton,
    IonAlert,
    IonToast
  ]
})
export class OrdersPage implements OnInit {
  handleCancelCancel() {
    this.showCancelAlert = false;
    this.orderToCancel = null;
  }

  handleCancelConfirm() {
    this.confirmCancelOrder();
  }
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  loading = false;
  selectedFilter = 'all';
  showCancelAlert = false;
  orderToCancel: string | null = null;
  showToast = false;
  toastMessage = '';

  cancelButtons = [
    { text: 'Keep Order', role: 'cancel', handler: () => { this.showCancelAlert = false; this.orderToCancel = null; } },
    { text: 'Cancel Order', role: 'confirm', handler: () => this.confirmCancelOrder() }
  ];

  filterOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' }
  ];

  constructor(
    private ordersService: OrdersService,
    private router: Router
  ) {
    addIcons({refreshOutline,cardOutline,timeOutline,locationOutline,closeCircleOutline,receiptOutline,checkmarkCircleOutline});
  }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.ordersService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.filterOrders();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.loading = false;
      }
    });
  }

  filterOrders() {
    switch (this.selectedFilter) {
      case 'active':
        this.filteredOrders = this.orders.filter(order => 
          ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(order.status)
        );
        break;
      case 'completed':
        this.filteredOrders = this.orders.filter(order => 
          ['delivered', 'cancelled'].includes(order.status)
        );
        break;
      default:
        this.filteredOrders = [...this.orders];
    }
  }

  onFilterChange(event: any) {
    this.selectedFilter = event.detail.value;
    this.filterOrders();
  }

  doRefresh(event: any) {
    this.loadOrders();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  viewOrderDetails(orderId: string) {
    // Navigate to order details page
    this.router.navigate(['/order-details', orderId]);
  }

  reorderItems(order: Order) {
    // Add all items from this order back to cart
    order.items.forEach(item => {
      // Note: You'd need to inject ProductsService here
      // this.productsService.addToCart(item.product, item.quantity);
    });
    this.showToastMessage('Items added to cart');
    this.router.navigate(['/tabs/cart']);
  }

  cancelOrder(orderId: string) {
    this.orderToCancel = orderId;
    this.showCancelAlert = true;
  }

  confirmCancelOrder() {
    if (this.orderToCancel) {
      this.ordersService.cancelOrder(this.orderToCancel).subscribe({
        next: (success) => {
          if (success) {
            this.showToastMessage('Order cancelled successfully');
            this.loadOrders();
          } else {
            this.showToastMessage('Unable to cancel order');
          }
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
          this.showToastMessage('Error cancelling order');
        }
      });
    }
    this.showCancelAlert = false;
    this.orderToCancel = null;
  }

  canCancelOrder(order: Order): boolean {
    return ['pending', 'confirmed'].includes(order.status);
  }

  getStatusColor(status: Order['status']): string {
    return this.ordersService.getStatusColor(status);
  }

  getStatusText(status: Order['status']): string {
    return this.ordersService.getStatusText(status);
  }

  formatPrice(price: number): string {
    return this.ordersService.formatPrice(price);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  }

  getItemCount(order: Order): number {
    return order.items.reduce((count, item) => count + item.quantity, 0);
  }

  showToastMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;
  }

  trackByOrderId(index: number, order: Order): string {
    return order.id;
  }
}