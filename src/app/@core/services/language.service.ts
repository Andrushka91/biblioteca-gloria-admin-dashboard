import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, forkJoin } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class LanguageService {
  private currentLanguage = new BehaviorSubject<string>("en");
  public currentLanguage$ = this.currentLanguage.asObservable();
  private translations: any = {};
  private translationsLoaded = new BehaviorSubject<boolean>(false);
  public translationsLoaded$ = this.translationsLoaded.asObservable();

  constructor(private http: HttpClient) {
    // Check localStorage for saved language preference
    const savedLang = localStorage.getItem("selectedLanguage");
    if (savedLang && (savedLang === "en" || savedLang === "ro")) {
      this.currentLanguage.next(savedLang);
    }

    // Load initial translations
    this.loadTranslations();
  }

  private loadTranslations() {
    console.log("Loading translations...");

    // Load both language files
    forkJoin({
      en: this.http.get<any>("assets/i18n/en.json"),
      ro: this.http.get<any>("assets/i18n/ro.json"),
    }).subscribe({
      next: (data) => {
        console.log("Translations loaded successfully:", data);
        this.translations = {
          en: data.en.translations || data.en,
          ro: data.ro.translations || data.ro,
        };
        this.translationsLoaded.next(true);
        console.log("Translations ready:", this.translations);
      },
      error: (error) => {
        console.error("Failed to load translations:", error);
        // Set empty translations to prevent errors
        this.translations = {
          en: {},
          ro: {},
        };
        this.translationsLoaded.next(true);
      },
    });
  }

  setLanguage(language: string) {
    this.currentLanguage.next(language);
    localStorage.setItem("selectedLanguage", language);
  }

  getCurrentLanguage(): string {
    return this.currentLanguage.value;
  }

  translate(key: string): string {
    const currentLang = this.getCurrentLanguage() as "en" | "ro";

    // Check if translations are loaded
    if (!this.translations || !this.translations[currentLang]) {
      // Return key as fallback without console warning to avoid spam
      return key;
    }

    return this.translations[currentLang]?.[key] || key;
  }

  // Method to check if translations are ready
  areTranslationsLoaded(): boolean {
    return this.translationsLoaded.value;
  }

  // Method to wait for translations to load
  waitForTranslations(): Observable<boolean> {
    return this.translationsLoaded$;
  }
}
