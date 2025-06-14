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
  originalPrice?: number;
  discount?: string;
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
      name: 'Samsung Galaxy S24 Ultra',
      description: 'Latest flagship smartphone with AI features',
      price: 124999,
      originalPrice: 134999,
      discount: '7% OFF',
      category: 'Mobiles',
      inStock: true,
      rating: 4.8,
      reviews: 2156,
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'
    },
    {
      id: '2',
      name: 'iPhone 15 Pro Max',
      description: 'Premium iPhone with titanium design',
      price: 159900,
      originalPrice: 164900,
      discount: '3% OFF',
      category: 'Mobiles',
      inStock: true,
      rating: 4.9,
      reviews: 1889,
      imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop'
    },
    {
      id: '3',
      name: 'OnePlus 12',
      description: 'Flagship killer with Snapdragon 8 Gen 3',
      price: 64999,
      originalPrice: 69999,
      discount: '7% OFF',
      category: 'Mobiles',
      inStock: true,
      rating: 4.7,
      reviews: 1234,
      imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop'
    },
    {
      id: '4',
      name: 'Levi\'s Men\'s Jeans',
      description: 'Classic straight fit denim jeans',
      price: 2499,
      originalPrice: 3999,
      discount: '37% OFF',
      category: 'Men\'s Fashion',
      inStock: true,
      rating: 4.5,
      reviews: 892,
      imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop'
    },
    {
      id: '5',
      name: 'Nike Air Max Shoes',
      description: 'Comfortable running shoes for men',
      price: 7999,
      originalPrice: 9999,
      discount: '20% OFF',
      category: 'Men\'s Fashion',
      inStock: true,
      rating: 4.6,
      reviews: 567,
      imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop'
    },
    {
      id: '6',
      name: 'Formal Shirt',
      description: 'Cotton formal shirt for office wear',
      price: 1299,
      originalPrice: 1999,
      discount: '35% OFF',
      category: 'Men\'s Fashion',
      inStock: true,
      rating: 4.3,
      reviews: 445,
      imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop'
    },
    {
      id: '7',
      name: 'Kurti Set',
      description: 'Beautiful ethnic kurti with dupatta',
      price: 1899,
      originalPrice: 2999,
      discount: '36% OFF',
      category: 'Women\'s Fashion',
      inStock: true,
      rating: 4.7,
      reviews: 678,
      imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop'
    },
    {
      id: '8',
      name: 'Saree Collection',
      description: 'Elegant silk saree for special occasions',
      price: 4999,
      originalPrice: 7999,
      discount: '37% OFF',
      category: 'Women\'s Fashion',
      inStock: true,
      rating: 4.8,
      reviews: 234,
      imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop'
    },
    {
      id: '9',
      name: 'Laptop Backpack',
      description: 'Waterproof laptop bag with multiple compartments',
      price: 1599,
      originalPrice: 2499,
      discount: '36% OFF',
      category: 'Electronics',
      inStock: true,
      rating: 4.4,
      reviews: 789,
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop'
    },
    {
      id: '10',
      name: 'Wireless Earbuds',
      description: 'True wireless earbuds with noise cancellation',
      price: 3999,
      originalPrice: 5999,
      discount: '33% OFF',
      category: 'Electronics',
      inStock: true,
      rating: 4.5,
      reviews: 1123,
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop'
    },
    {
      id: '11',
      name: 'Smart Watch',
      description: 'Fitness tracker with heart rate monitor',
      price: 8999,
      originalPrice: 12999,
      discount: '30% OFF',
      category: 'Electronics',
      inStock: true,
      rating: 4.6,
      reviews: 445,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'
    },
    {
      id: '12',
      name: 'Home Decor Set',
      description: 'Beautiful decorative items for your home',
      price: 2999,
      originalPrice: 4999,
      discount: '40% OFF',
      category: 'Home & Kitchen',
      inStock: true,
      rating: 4.2,
      reviews: 234,
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop'
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