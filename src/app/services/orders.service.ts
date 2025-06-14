import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from './products.service';
import { InrCurrencyPipe } from '../pipes/inr-currency.pipe';

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
            name: 'Samsung Galaxy S24',
            description: 'Latest flagship smartphone with AI features',
            price: 79999,
            category: 'Mobiles',
            inStock: true,
            rating: 4.8,
            reviews: 156
          },
          quantity: 1
        }
      ],
      total: 79999,
      deliveryFee: 49,
      finalTotal: 80048,
      status: 'delivered',
      orderDate: new Date('2024-01-15T10:30:00'),
      deliveryAddress: 'A-123, Sector 15, Noida, Uttar Pradesh 201301',
      paymentMethod: 'UPI'
    },
    {
      id: 'ORD-002',
      items: [
        {
          product: {
            id: '3',
            name: 'Nike Air Max Shoes',
            description: 'Comfortable running shoes for men',
            price: 8999,
            category: "Men's Fashion",
            inStock: true,
            rating: 4.6,
            reviews: 234
          },
          quantity: 1
        },
        {
          product: {
            id: '4',
            name: 'Levi\'s Denim Jeans',
            description: 'Classic blue denim jeans for men',
            price: 2999,
            category: "Men's Fashion",
            inStock: true,
            rating: 4.4,
            reviews: 67
          },
          quantity: 2
        }
      ],
      total: 14997,
      deliveryFee: 49,
      finalTotal: 15046,
      status: 'out_for_delivery',
      orderDate: new Date('2024-01-20T14:15:00'),
      estimatedDelivery: new Date('2024-01-20T16:00:00'),
      deliveryAddress: 'B-456, Bandra West, Mumbai, Maharashtra 400050',
      paymentMethod: 'Credit Card'
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
      const deliveryFee = 49;
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
        description: 'Order successfully place ho gaya'
      }
    ];

    if (['confirmed', 'preparing', 'out_for_delivery', 'delivered'].includes(order.status)) {
      baseStatuses.push({
        status: 'confirmed',
        timestamp: new Date(order.orderDate.getTime() + 2 * 60 * 1000),
        description: 'Order confirm ho gaya hai'
      });
    }

    if (['preparing', 'out_for_delivery', 'delivered'].includes(order.status)) {
      baseStatuses.push({
        status: 'preparing',
        timestamp: new Date(order.orderDate.getTime() + 10 * 60 * 1000),
        description: 'Aapka order prepare ho raha hai'
      });
    }

    if (['out_for_delivery', 'delivered'].includes(order.status)) {
      baseStatuses.push({
        status: 'out_for_delivery',
        timestamp: new Date(order.orderDate.getTime() + 25 * 60 * 1000),
        description: 'Order delivery ke liye nikal gaya'
      });
    }

    if (order.status === 'delivered') {
      baseStatuses.push({
        status: 'delivered',
        timestamp: new Date(order.orderDate.getTime() + 40 * 60 * 1000),
        description: 'Order successfully deliver ho gaya'
      });
    }

    if (order.status === 'cancelled') {
      baseStatuses.push({
        status: 'cancelled',
        timestamp: new Date(),
        description: 'Order cancel ho gaya'
      });
    }

    return baseStatuses;
  }

  formatPrice(price: number): string {
    const pipe = new InrCurrencyPipe();
    return pipe.transform(price);
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
      case 'preparing': return 'Prepare ho raha';
      case 'out_for_delivery': return 'Delivery mein';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  }
}