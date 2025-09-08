import { Component, OnInit, OnDestroy } from "@angular/core";
import { LanguageService } from "../../../@core/services/language.service";
import { Subscription } from "rxjs";

@Component({
  selector: "ngx-footer",
  styleUrls: ["./footer.component.scss"],
  template: `
    <span class="created-by">
      Created with ♥ by
      <b><a href="https://akveo.page.link/8V2f" target="_blank">Akveo</a></b>
      2019
    </span>
    <div class="footer-actions">
      <div class="language-selector">
        <nb-select
          placeholder="Language"
          (selectedChange)="changeLanguage($event)"
        >
          <nb-option value="en">US</nb-option>
          <nb-option value="ro">RO</nb-option>
        </nb-select>
      </div>
      <div class="socials">
        <a href="#" target="_blank" class="ion ion-social-github"></a>
        <a href="#" target="_blank" class="ion ion-social-facebook"></a>
        <a href="#" target="_blank" class="ion ion-social-twitter"></a>
        <a href="#" target="_blank" class="ion ion-social-linkedin"></a>
      </div>
    </div>
  `,
})
export class FooterComponent implements OnInit, OnDestroy {
  currentLanguage = "en";
  private subscription: Subscription;

  constructor(private languageService: LanguageService) {}

  ngOnInit() {
    // Initialize with current language from service
    this.currentLanguage = this.languageService.getCurrentLanguage();

    // Subscribe to language changes (optional for other components)
    this.subscription = this.languageService.currentLanguage$.subscribe(
      (lang) => {
        console.log("Language changed to:", lang);
        this.currentLanguage = lang;
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  changeLanguage(language: string) {
    if (language && language !== this.currentLanguage) {
      console.log(
        "Changing language from",
        this.currentLanguage,
        "to",
        language
      );
      this.languageService.setLanguage(language);
    }
  }
}
