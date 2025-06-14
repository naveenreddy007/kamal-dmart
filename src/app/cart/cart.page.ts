import { Component, OnInit } from '@angular/core';
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
  IonGrid,
  IonRow,
  IonCol,
  IonButtons,
  IonBackButton,
  IonToast,
  IonAlert
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { removeOutline, addOutline, trashOutline, cartOutline } from 'ionicons/icons';
import { ProductsService, CartItem } from '../services/products.service';
import { InrCurrencyPipe } from '../pipes/inr-currency.pipe';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonButton,
    IonIcon,
    IonBadge,
    IonCard,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButtons,
    IonBackButton,
    IonToast,
    IonAlert,
    InrCurrencyPipe
  ]
})
export class CartPage implements OnInit {
  handleClearCancel() {
    this.showClearAlert = false;
  }

  handleClearConfirm() {
    this.confirmClearCart();
  }
  cartItems: CartItem[] = [];
  total = 0;
  showToast = false;
  toastMessage = '';
  showClearAlert = false;

  clearButtons = [
    {
      text: 'Cancel Karo',
      role: 'cancel',
      handler: () => {
        this.showClearAlert = false;
      }
    },
    {
      text: 'Clear Karo',
      role: 'confirm',
      handler: () => {
        this.confirmClearCart();
      }
    }
  ];

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) {
    addIcons({ removeOutline, addOutline, trashOutline, cartOutline });
  }

  ngOnInit() {
    this.subscribeToCart();
  }

  subscribeToCart() {
    this.productsService.cartItems$.subscribe(cartItems => {
      this.cartItems = cartItems;
      this.total = this.productsService.getCartTotal();
    });
  }

  increaseQuantity(productId: string) {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item) {
      this.productsService.updateCartItemQuantity(productId, item.quantity + 1);
    }
  }

  decreaseQuantity(productId: string) {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item && item.quantity > 1) {
      this.productsService.updateCartItemQuantity(productId, item.quantity - 1);
    }
  }

  removeItem(productId: string) {
    this.productsService.removeFromCart(productId);
    this.showToastMessage('Item cart se remove ho gaya');
  }

  clearCart() {
    this.showClearAlert = true;
  }

  confirmClearCart() {
    this.productsService.clearCart();
    this.showToastMessage('Cart clear ho gaya');
    this.showClearAlert = false;
  }

  proceedToCheckout() {
    if (this.cartItems.length === 0) {
      this.showToastMessage('Aapka cart khali hai');
      return;
    }
    
    // Navigate to checkout or order page
    this.router.navigate(['/tabs/orders']);
    this.showToastMessage('Checkout ke liye ja rahe hain...');
  }

  continueShopping() {
    this.router.navigate(['/tabs/products']);
  }

  showToastMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;
  }

  formatPrice(price: number): string {
    return `₹${price.toFixed(2)}`;
  }

  getItemTotal(item: CartItem): number {
    return item.product.price * item.quantity;
  }
}