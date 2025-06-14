import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonToggle, IonSelect, IonSelectOption, IonLabel, IonButton,
  IonNote
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonToggle, IonSelect, IonSelectOption, IonLabel, IonButton,
    IonNote,
    RouterLink],
})
export class Tab3Page {
  constructor() {}
}
