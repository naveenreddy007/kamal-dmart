import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from './products.service';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  deliveryFee: number;
  finalTotal: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  orderDate: Date;
  estimatedDelivery?: Date;
  deliveryAddress: string;
  paymentMethod: string;
  customerNotes?: string;
}

export interface OrderStatus {
  status: Order['status'];
  timestamp: Date;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private orders = new BehaviorSubject<Order[]>([]);
  public orders$ = this.orders.asObservable();

  private mockOrders: Order[] = [
    {
      id: 'ORD-001',
      items: [
        {
          product: {
            id: '1',
            name: 'Premium Coffee Beans',
            description: 'High-quality arabica coffee beans from Colombia',
            price: 24.99,
            category: 'Beverages',
            inStock: true,
            rating: 4.8,
            reviews: 156
          },
          quantity: 2
        }
      ],
      total: 49.98,
      deliveryFee: 2.99,
      finalTotal: 52.97,
      status: 'delivered',
      orderDate: new Date('2024-01-15T10:30:00'),
      deliveryAddress: '123 Main St, City, State 12345',
      paymentMethod: 'Credit Card'
    },
    {
      id: 'ORD-002',
      items: [
        {
          product: {
            id: '3',
            name: 'Artisan Chocolate',
            description: 'Handcrafted dark chocolate with 70% cocoa',
            price: 12.99,
            category: 'Sweets',
            inStock: true,
            rating: 4.9,
            reviews: 234
          },
          quantity: 1
        },
        {
          product: {
            id: '4',
            name: 'Fresh Croissants',
            description: 'Buttery, flaky croissants baked fresh daily',
            price: 8.99,
            category: 'Bakery',
            inStock: true,
            rating: 4.7,
            reviews: 67
          },
          quantity: 3
        }
      ],
      total: 39.96,
      deliveryFee: 2.99,
      finalTotal: 42.95,
      status: 'out_for_delivery',
      orderDate: new Date('2024-01-20T14:15:00'),
      estimatedDelivery: new Date('2024-01-20T16:00:00'),
      deliveryAddress: '456 Oak Ave, City, State 12345',
      paymentMethod: 'PayPal'
    }
  ];

  constructor() {
    this.orders.next(this.mockOrders);
  }

  getOrders(): Observable<Order[]> {
    return this.orders.asObservable();
  }

  getOrderById(orderId: string): Observable<Order | undefined> {
    return new Observable(observer => {
      const order = this.orders.value.find(o => o.id === orderId);
      observer.next(order);
      observer.complete();
    });
  }

  createOrder(cartItems: CartItem[], deliveryAddress: string, paymentMethod: string, customerNotes?: string): Observable<Order> {
    return new Observable(observer => {
      const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      const deliveryFee = 2.99;
      const finalTotal = total + deliveryFee;
      
      const newOrder: Order = {
        id: `ORD-${Date.now()}`,
        items: [...cartItems],
        total,
        deliveryFee,
        finalTotal,
        status: 'pending',
        orderDate: new Date(),
        estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
        deliveryAddress,
        paymentMethod,
        customerNotes
      };

      const currentOrders = this.orders.value;
      currentOrders.unshift(newOrder); // Add to beginning of array
      this.orders.next([...currentOrders]);

      // Simulate order processing
      setTimeout(() => {
        this.updateOrderStatus(newOrder.id, 'confirmed');
      }, 2000);

      observer.next(newOrder);
      observer.complete();
    });
  }

  updateOrderStatus(orderId: string, status: Order['status']): void {
    const currentOrders = this.orders.value;
    const orderIndex = currentOrders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
      currentOrders[orderIndex].status = status;
      this.orders.next([...currentOrders]);
    }
  }

  cancelOrder(orderId: string): Observable<boolean> {
    return new Observable(observer => {
      const currentOrders = this.orders.value;
      const order = currentOrders.find(o => o.id === orderId);
      
      if (order && ['pending', 'confirmed'].includes(order.status)) {
        this.updateOrderStatus(orderId, 'cancelled');
        observer.next(true);
      } else {
        observer.next(false);
      }
      observer.complete();
    });
  }

  getOrderStatusHistory(orderId: string): OrderStatus[] {
    // Mock status history - in real app, this would come from backend
    const order = this.orders.value.find(o => o.id === orderId);
    if (!order) return [];

    const baseStatuses: OrderStatus[] = [
      {
        status: 'pending',
        timestamp: order.orderDate,
        description: 'Order placed successfully'
      }
    ];

    if (['confirmed', 'preparing', 'out_for_delivery', 'delivered'].includes(order.status)) {
      baseStatuses.push({
        status: 'confirmed',
        timestamp: new Date(order.orderDate.getTime() + 2 * 60 * 1000),
        description: 'Order confirmed by restaurant'
      });
    }

    if (['preparing', 'out_for_delivery', 'delivered'].includes(order.status)) {
      baseStatuses.push({
        status: 'preparing',
        timestamp: new Date(order.orderDate.getTime() + 10 * 60 * 1000),
        description: 'Your order is being prepared'
      });
    }

    if (['out_for_delivery', 'delivered'].includes(order.status)) {
      baseStatuses.push({
        status: 'out_for_delivery',
        timestamp: new Date(order.orderDate.getTime() + 25 * 60 * 1000),
        description: 'Order is out for delivery'
      });
    }

    if (order.status === 'delivered') {
      baseStatuses.push({
        status: 'delivered',
        timestamp: new Date(order.orderDate.getTime() + 40 * 60 * 1000),
        description: 'Order delivered successfully'
      });
    }

    if (order.status === 'cancelled') {
      baseStatuses.push({
        status: 'cancelled',
        timestamp: new Date(),
        description: 'Order cancelled'
      });
    }

    return baseStatuses;
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  getStatusColor(status: Order['status']): string {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'primary';
      case 'preparing': return 'secondary';
      case 'out_for_delivery': return 'tertiary';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'medium';
    }
  }

  getStatusText(status: Order['status']): string {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'preparing': return 'Preparing';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  }
}