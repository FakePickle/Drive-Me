import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  constructor() {}

  navigateTo(section: string): void {
    console.log(`Navigating to ${section}`);
  }

}
