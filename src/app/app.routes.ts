import { Routes } from '@angular/router';
import { LoginPage } from './login/login.page';

export const routes: Routes = [
    {
    path: 'login',
    component: LoginPage,
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
];
