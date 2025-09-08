import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Book } from "../../models/book.model";

@Injectable({
  providedIn: "root",
})
export class BooksService {
  private baseUrl = `${environment.apiUrl}/books`;

  constructor(private http: HttpClient) {}

  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}/all`);
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.baseUrl}/${id}`);
  }

  createBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.baseUrl, book);
  }

  /**
   * Create book with multipart form data (includes image upload)
   * Matches your NestJS backend that expects FormData with 'photo' field
   * @param bookData Book form data (ALL FIELDS REQUIRED: title, author, isbn, publishedYear, totalCopies, availableCopies)
   * @param photoFile Image file (OPTIONAL - book can be created without photo)
   * @returns Observable with created book (automatically sets status to "Available")
   */
  createBookWithPhoto(bookData: any, photoFile?: File): Observable<Book> {
    const formData = new FormData();

    // Add all book fields to FormData
    formData.append("title", bookData.title);
    formData.append("author", bookData.author);
    formData.append("isbn", bookData.isbn);
    formData.append("publishedYear", bookData.publishedYear.toString());
    formData.append("totalCopies", bookData.totalCopies.toString());
    formData.append("availableCopies", bookData.availableCopies.toString());

    // Add default status for new books
    formData.append("status", "Available");

    // Add photo file if provided (matches your backend's 'photo' field name)
    if (photoFile) {
      formData.append("photo", photoFile);
    }

    return this.http.post<Book>(this.baseUrl, formData);
  }

  updateBook(id: number, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.baseUrl}/${id}`, book);
  }

  deleteBook(id: number | string): Observable<any> {
    // Your backend expects bookId in the request body, not as URL parameter
    return this.http.delete(this.baseUrl, {
      body: { bookId: id.toString() },
    });
  }
}
