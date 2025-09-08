import { Component } from "@angular/core";

// import { MENU_ITEMS } from "./old-pages-menu"; // Backed up as old-pages-menu.ts.backup

@Component({
  selector: "ngx-old-pages",
  styleUrls: ["old-pages.component.scss"],
  template: `
    <ngx-one-column-layout>
      <!-- Old pages menu no longer needed - routes integrated into main pages -->
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class OldPagesComponent {
  // menu = MENU_ITEMS; // No longer needed
}

// Keep the original export for backward compatibility
export class PagesComponent extends OldPagesComponent {}
