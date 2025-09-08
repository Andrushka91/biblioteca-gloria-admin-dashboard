import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { LanguageService } from "../../@core/services/language.service";
import { Subscription } from "rxjs";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { AddBookModalComponent } from "./add-book-modal/add-book-modal.component";
import { BooksService } from "./books.service";
import { Book } from "../../models/book.model";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";

@Component({
  selector: "ngx-books",
  templateUrl: "./books.component.html",
  styleUrls: ["./books.component.scss"],
})
export class BooksComponent implements OnInit, OnDestroy, AfterViewInit {
  settings: any;
  private subscription: Subscription;
  private routerSubscription: Subscription;
  pageTitle: string = "";
  booksData: any[] = [];

  source: LocalDataSource = new LocalDataSource();

  constructor(
    public languageService: LanguageService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private booksService: BooksService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log("BooksComponent ngOnInit called");

    // Initialize with default values to avoid translation errors
    this.pageTitle = "Books Management";
    this.initializeDefaultTableSettings();

    // Load books immediately
    this.loadBooks();

    // Wait for translations to load, then update UI
    this.languageService.waitForTranslations().subscribe((loaded) => {
      if (loaded) {
        console.log("Translations loaded, updating UI...");
        this.updatePageTitle();
        this.updateTableSettings();
      }
    });

    // Subscribe to language changes and update table settings
    this.subscription = this.languageService.currentLanguage$.subscribe(() => {
      if (this.languageService.areTranslationsLoaded()) {
        this.updatePageTitle();
        this.updateTableSettings();
      }
    });

    // Subscribe to router events to refresh data when navigating back to this component
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url.includes("/pages/books")) {
          console.log("Navigated to books page, refreshing data...");
          this.loadBooks();
        }
      });
  }

  ngAfterViewInit() {
    // Refresh data after view is initialized to ensure component is fully loaded
    setTimeout(() => {
      this.loadBooks();
    }, 100);
  }

  /**
   * Load books from database
   */
  private loadBooks() {
    console.log("=== loadBooks() called ===");
    console.log("Loading books from API...");
    console.log("Auth token:", localStorage.getItem("auth_token"));
    console.log("API URL:", this.booksService);

    this.booksService.getAllBooks().subscribe({
      next: (books: Book[]) => {
        console.log("=== API Response Success ===");
        console.log("Books loaded successfully:", books);
        console.log("Number of books:", books?.length || 0);

        // Your backend returns Book[] directly from getAllBooks()
        if (Array.isArray(books)) {
          // Log the first book to see the photo field structure
          if (books.length > 0) {
            console.log("First book data:", books[0]);
            console.log("Photo field:", books[0].photo);
          }

          // Apply status logic and resize images for all books
          this.processBooks(books);
        } else {
          console.error("Expected array but got:", typeof books);
          this.booksData = [];
          this.source.load(this.booksData);
        }
      },
      error: (error) => {
        console.log("=== API Response Error ===");
        console.error("Error loading books - Status:", error.status);
        console.error("Error details:", error);

        let errorMessage = "Failed to load books";
        if (error.status === 401) {
          errorMessage = "Authentication required. Please log in again.";
        } else if (error.status === 403) {
          errorMessage = "Access denied. Insufficient permissions.";
        } else if (error.status === 0) {
          errorMessage =
            "Cannot connect to server. Check if backend is running.";
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        this.toastrService.danger(errorMessage, "Error");
        // Initialize with empty array on error
        this.booksData = [];
        this.source.load(this.booksData);
      },
    });
  }

  /**
   * Process books by resizing images and applying status logic
   */
  private async processBooks(books: Book[]): Promise<void> {
    console.log("Processing books with image resizing...");

    const processedBooks = await Promise.all(
      books.map(async (book) => {
        let resizedPhotoUrl = book.photo;

        // If the book has a photo, resize it
        if (book.photo && book.photo.startsWith("http")) {
          try {
            resizedPhotoUrl = await this.resizeImage(book.photo, 80, 96);
          } catch (error) {
            console.error("Error resizing image for book:", book.title, error);
            // Keep original photo if resize fails
            resizedPhotoUrl = book.photo;
          }
        }

        return {
          ...book,
          photo: resizedPhotoUrl,
          status: this.getBookStatus(book.availableCopies, book.status),
        };
      })
    );

    this.booksData = processedBooks;
    this.source.load(this.booksData);
    console.log("Table updated with", this.booksData.length, "processed books");
    console.log("Sample processed book data:", this.booksData[0]);
  }

  /**
   * Resize image to specified dimensions using Canvas
   */
  private resizeImage(
    imageUrl: string,
    targetWidth: number,
    targetHeight: number
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; // Enable CORS for cross-origin images

      img.onload = () => {
        // Create canvas
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Set canvas dimensions to target size
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Draw resized image
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Convert to data URL
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8); // 80% quality
        resolve(dataUrl);
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = imageUrl;
    });
  }

  /**
   * Determines book status based on available copies and current status
   */
  private getBookStatus(
    availableCopies: number,
    currentStatus?: string
  ): string {
    // Special statuses override the automatic logic
    if (
      currentStatus === "Under Maintenance" ||
      currentStatus === "Discontinued"
    ) {
      return currentStatus;
    }

    // Automatic status based on availability
    return availableCopies > 0 ? "Available" : "Out of Stock";
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  updatePageTitle() {
    this.pageTitle = this.languageService.translate("Books Management");
  }

  initializeDefaultTableSettings() {
    this.settings = {
      actions: {
        columnTitle: "Actions",
        add: false,
        edit: false,
        delete: true,
        position: "right",
      },
      add: {
        addButtonContent: "",
        createButtonContent: "",
        cancelButtonContent: "",
        confirmCreate: false,
      },
      edit: {
        editButtonContent: "",
        saveButtonContent: "",
        cancelButtonContent: "",
        confirmSave: false,
      },
      delete: {
        deleteButtonContent: '<i class="nb-trash"></i>',
        confirmDelete: true,
      },
      columns: {
        photo: {
          title: "",
          type: "html",
          filter: false,
          sort: false,
          width: "110px",
          valuePrepareFunction: (value) => {
            if (
              value &&
              typeof value === "string" &&
              (value.startsWith("http") || value.startsWith("data:"))
            ) {
              return `<img src="${value}" />`;
            }
            return '<div class="book-placeholder">📖</div>';
          },
        },
        title: {
          title: "Title",
          type: "string",
        },
        author: {
          title: "Author",
          type: "string",
        },
        isbn: {
          title: "ISBN",
          type: "string",
        },
        publishedYear: {
          title: "Published Year",
          type: "number",
        },
        availableCopies: {
          title: "Available Copies",
          type: "number",
        },
        totalCopies: {
          title: "Total Copies",
          type: "number",
        },
        status: {
          title: "Status",
          type: "string",
        },
      },
      pager: {
        display: true,
        perPage: 5,
      },
    };
  }

  updateTableSettings() {
    this.settings = {
      actions: {
        columnTitle: this.languageService.translate("Actions"),
        add: false,
        edit: false,
        delete: true,
        position: "right",
      },
      add: {
        addButtonContent: "",
        createButtonContent: "",
        cancelButtonContent: "",
        confirmCreate: false,
      },
      edit: {
        editButtonContent: "",
        saveButtonContent: "",
        cancelButtonContent: "",
        confirmSave: false,
      },
      delete: {
        deleteButtonContent: '<i class="nb-trash"></i>',
        confirmDelete: true,
      },
      columns: {
        photo: {
          title: "",
          type: "html",
          filter: false,
          sort: false,
          width: "110px",
          valuePrepareFunction: (value) => {
            if (
              value &&
              typeof value === "string" &&
              (value.startsWith("http") || value.startsWith("data:"))
            ) {
              return `<img src="${value}" />`;
            }
            return '<div class="book-placeholder">📖</div>';
          },
        },
        title: {
          title: this.languageService.translate("Title"),
          type: "string",
        },
        author: {
          title: this.languageService.translate("Author"),
          type: "string",
        },
        isbn: {
          title: "ISBN",
          type: "string",
        },
        publishedYear: {
          title: this.languageService.translate("Published Year"),
          type: "number",
        },
        availableCopies: {
          title: this.languageService.translate("Available Copies"),
          type: "number",
        },
        totalCopies: {
          title: this.languageService.translate("Total Copies"),
          type: "number",
        },
        status: {
          title: this.languageService.translate("Status"),
          type: "string",
        },
      },
      pager: {
        display: true,
        perPage: 5,
      },
    };

    // Force refresh table with new settings
    console.log("Updated table settings:", this.settings);
    this.source.refresh();
  }

  onDeleteConfirm(event): void {
    const confirmMessage = this.languageService.translate(
      "books.confirmDelete"
    );
    if (window.confirm(confirmMessage)) {
      // Use _id for MongoDB or fallback to id
      const bookId = event.data._id || event.data.id;
      console.log("Deleting book with ID:", bookId);

      // Call backend API to delete the book
      this.booksService.deleteBook(bookId).subscribe({
        next: (response) => {
          console.log("Delete response:", response);
          event.confirm.resolve();
          this.toastrService.success(
            response.message || "Book deleted successfully",
            "Success"
          );
          // Reload data from database
          this.loadBooks();
        },
        error: (error) => {
          console.error("Delete error:", error);
          event.confirm.reject();
          this.toastrService.danger(
            error.error?.message || "Failed to delete book",
            "Error"
          );
        },
      });
    } else {
      event.confirm.reject();
    }
  }

  openAddBookModal(): void {
    const dialogRef = this.dialogService.open(AddBookModalComponent, {
      context: {},
      closeOnBackdropClick: false,
      closeOnEsc: false,
    });

    dialogRef.onClose.subscribe((result) => {
      if (result) {
        // Reload all books from database to get the latest data
        this.loadBooks();
        this.toastrService.success(
          this.languageService.translate("books.createSuccess"),
          this.languageService.translate("Success")
        );
      }
    });
  }
}
