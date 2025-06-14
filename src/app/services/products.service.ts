import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  inStock: boolean;
  rating?: number;
  reviews?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItems.asObservable();

  private products: Product[] = [
    {
      id: '1',
      name: 'Premium Coffee Beans',
      description: 'High-quality arabica coffee beans from Colombia',
      price: 24.99,
      category: 'Beverages',
      inStock: true,
      rating: 4.8,
      reviews: 156,
      imageUrl: 'assets/coffee-beans.jpg'
    },
    {
      id: '2',
      name: 'Organic Green Tea',
      description: 'Premium organic green tea leaves',
      price: 18.50,
      category: 'Beverages',
      inStock: true,
      rating: 4.6,
      reviews: 89,
      imageUrl: 'assets/green-tea.jpg'
    },
    {
      id: '3',
      name: 'Artisan Chocolate',
      description: 'Handcrafted dark chocolate with 70% cocoa',
      price: 12.99,
      category: 'Sweets',
      inStock: true,
      rating: 4.9,
      reviews: 234,
      imageUrl: 'assets/chocolate.jpg'
    },
    {
      id: '4',
      name: 'Fresh Croissants',
      description: 'Buttery, flaky croissants baked fresh daily',
      price: 8.99,
      category: 'Bakery',
      inStock: true,
      rating: 4.7,
      reviews: 67,
      imageUrl: 'assets/croissants.jpg'
    },
    {
      id: '5',
      name: 'Gourmet Pizza',
      description: 'Wood-fired pizza with premium toppings',
      price: 16.99,
      category: 'Food',
      inStock: false,
      rating: 4.5,
      reviews: 123
    }
  ];

  constructor() { }

  getProducts(): Observable<Product[]> {
    return new Observable(observer => {
      // Simulate API call delay
      setTimeout(() => {
        observer.next(this.products);
        observer.complete();
      }, 500);
    });
  }

  getProductById(id: string): Observable<Product | undefined> {
    return new Observable(observer => {
      setTimeout(() => {
        const product = this.products.find(p => p.id === id);
        observer.next(product);
        observer.complete();
      }, 300);
    });
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return new Observable(observer => {
      setTimeout(() => {
        const filteredProducts = this.products.filter(p => p.category === category);
        observer.next(filteredProducts);
        observer.complete();
      }, 400);
    });
  }

  searchProducts(query: string): Observable<Product[]> {
    return new Observable(observer => {
      setTimeout(() => {
        const searchResults = this.products.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
        );
        observer.next(searchResults);
        observer.complete();
      }, 300);
    });
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentCart = this.cartItems.value;
    const existingItem = currentCart.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentCart.push({ product, quantity });
    }

    this.cartItems.next([...currentCart]);
  }

  removeFromCart(productId: string): void {
    const currentCart = this.cartItems.value;
    const updatedCart = currentCart.filter(item => item.product.id !== productId);
    this.cartItems.next(updatedCart);
  }

  updateCartItemQuantity(productId: string, quantity: number): void {
    const currentCart = this.cartItems.value;
    const item = currentCart.find(item => item.product.id === productId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.cartItems.next([...currentCart]);
      }
    }
  }

  clearCart(): void {
    this.cartItems.next([]);
  }

  getCartTotal(): number {
    return this.cartItems.value.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  getCartItemCount(): number {
    return this.cartItems.value.reduce((count, item) => count + item.quantity, 0);
  }
}