import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cartOutline, starOutline, star, addOutline } from 'ionicons/icons';
import { ProductsService, Product } from '../services/products.service';
import { InrCurrencyPipe } from '../pipes/inr-currency.pipe';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonBadge,
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner,
    IonRefresher,
    IonRefresherContent,
    IonToast,
    InrCurrencyPipe
  ]
})
export class ProductsPage implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = ['All', 'Mobiles', 'Men\'s Fashion', 'Women\'s Fashion', 'Electronics', 'Home & Kitchen'];
  selectedCategory = 'All';
  searchQuery = '';
  loading = false;
  cartItemCount = 0;
  showToast = false;
  toastMessage = '';

  constructor(private productsService: ProductsService) {
    addIcons({ cartOutline, starOutline, star, addOutline });
  }

  ngOnInit() {
    this.loadProducts();
    this.subscribeToCart();
  }

  loadProducts() {
    this.loading = true;
    this.productsService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filterProducts();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  subscribeToCart() {
    this.productsService.cartItems$.subscribe(cartItems => {
      this.cartItemCount = this.productsService.getCartItemCount();
    });
  }

  filterProducts() {
    let filtered = this.products;

    // Filter by category
    if (this.selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    this.filteredProducts = filtered;
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.detail.value;
    this.filterProducts();
  }

  onSearchChange(event: any) {
    this.searchQuery = event.detail.value;
    this.filterProducts();
  }

  addToCart(product: Product) {
    if (!product.inStock) {
      this.showToastMessage('Yeh product stock mein nahi hai');
      return;
    }

    this.productsService.addToCart(product);
    this.showToastMessage(`${product.name} cart mein add ho gaya`);
  }

  showToastMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;
  }

  doRefresh(event: any) {
    this.loadProducts();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  getStarArray(rating: number): boolean[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= Math.floor(rating));
    }
    return stars;
  }

  formatPrice(price: number): string {
    return `₹${price.toLocaleString('en-IN')}`;
  }
}