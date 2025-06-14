import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email!: string;
  password!: string;

  constructor(private navCtrl: NavController, private alertController: AlertController, private router: Router) {}

  async login() {
    if (this.email === 'test@example.com' && this.password === 'password') {
      this.navCtrl.navigateRoot('/tabs/tab1');
    } else {
      const alert = await this.alertController.create({
        header: 'Login Failed',
        message: 'Invalid email or password.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  register() {
    this.router.navigateByUrl('/register');
  }
}
