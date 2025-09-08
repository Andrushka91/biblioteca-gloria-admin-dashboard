import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NbDialogRef, NbToastrService } from "@nebular/theme";
import { BooksService } from "../books.service";
import { LanguageService } from "../../../@core/services/language.service";

@Component({
  selector: "ngx-add-book-modal",
  templateUrl: "./add-book-modal.component.html",
  styleUrls: ["./add-book-modal.component.scss"],
})
export class AddBookModalComponent implements OnInit {
  bookForm: FormGroup;
  isSubmitting = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  maxFileSize = 5 * 1024 * 1024; // 5MB
  acceptedTypes = ["image/jpeg", "image/png", "image/jpg"];

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: NbDialogRef<AddBookModalComponent>,
    private booksService: BooksService,
    private toastrService: NbToastrService,
    public languageService: LanguageService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.bookForm = this.formBuilder.group({
      title: ["", [Validators.required, Validators.minLength(2)]],
      author: ["", [Validators.required, Validators.minLength(2)]],
      isbn: ["", [Validators.required, Validators.pattern(/^[0-9-]+$/)]],
      publishedYear: [
        "",
        [
          Validators.required,
          Validators.min(1000),
          Validators.max(new Date().getFullYear()),
        ],
      ],
      totalCopies: ["", [Validators.required, Validators.min(1)]],
      availableCopies: ["", [Validators.required, Validators.min(0)]],
    });

    // Auto-set available copies when total copies changes
    this.bookForm.get("totalCopies")?.valueChanges.subscribe((total) => {
      if (total && !this.bookForm.get("availableCopies")?.value) {
        this.bookForm.patchValue({ availableCopies: total });
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!this.acceptedTypes.includes(file.type)) {
        this.toastrService.danger(
          this.languageService.translate("books.invalidFileType"),
          this.languageService.translate("Error")
        );
        return;
      }

      // Validate file size
      if (file.size > this.maxFileSize) {
        this.toastrService.danger(
          this.languageService.translate("books.fileTooLarge"),
          this.languageService.translate("Error")
        );
        return;
      }

      this.selectedFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    // Reset file input
    const fileInput = document.getElementById("bookImage") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  }

  onSubmit() {
    if (this.bookForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = this.bookForm.value;

    // Use single request with multipart form data (matches your NestJS backend)
    this.booksService
      .createBookWithPhoto(formData, this.selectedFile)
      .subscribe({
        next: (response) => {
          this.toastrService.success(
            this.languageService.translate("books.createSuccess"),
            this.languageService.translate("Success")
          );
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error("Book creation error:", error);
          this.toastrService.danger(
            this.languageService.translate("books.createError"),
            this.languageService.translate("Error")
          );
          this.isSubmitting = false;
        },
      });
  }

  private markFormGroupTouched() {
    Object.keys(this.bookForm.controls).forEach((key) => {
      const control = this.bookForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.bookForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.bookForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors["required"]) {
        return this.languageService.translate("books.fieldRequired");
      }
      if (field.errors["minlength"]) {
        return this.languageService.translate("books.fieldMinLength");
      }
      if (field.errors["pattern"]) {
        return this.languageService.translate("books.invalidFormat");
      }
      if (field.errors["min"]) {
        return this.languageService.translate("books.invalidValue");
      }
      if (field.errors["max"]) {
        return this.languageService.translate("books.invalidYear");
      }
    }
    return "";
  }

  onCancel() {
    this.dialogRef.close();
  }
}
