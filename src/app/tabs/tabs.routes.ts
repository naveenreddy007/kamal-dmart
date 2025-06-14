import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      // {
      //   path: 'tab1',
      //   loadComponent: () =>
      //     import('../tab1/tab1.page').then((m) => m.Tab1Page),
      // },
      // {
      //   path: 'tab2',
      //   loadComponent: () =>
      //     import('../tab2/tab2.page').then((m) => m.Tab2Page),
      // },
      // {
      //   path: 'tab3',
      //   loadComponent: () =>
      //     import('../tab3/tab3.page').then((m) => m.Tab3Page),
      // },
      {
        path: 'offers',
        loadComponent: () =>
          import('../offers/offers.page').then((m) => m.OffersPage),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('../products/products.page').then((m) => m.ProductsPage),
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('../cart/cart.page').then((m) => m.CartPage),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('../orders/orders.page').then((m) => m.OrdersPage),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('../notifications/notifications.page').then((m) => m.NotificationsPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../profile/profile.page').then((m) => m.ProfilePage),
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/offers',
    pathMatch: 'full',
  },
];
