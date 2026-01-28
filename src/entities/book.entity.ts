import { Book, BookCreateInput, BookUpdateInput, BookQueryParams, PaginatedResponse } from '../types';

export class BookEntity {
  static mapRowToBook(row: any): Book {
    return {
      id: row.id,
      title: row.title,
      author: row.author,
      year: row.year,
      price: row.price,
      is_active: row.is_active,
      description: row.description,
    };
  }

  static mapBookToRow(book: BookCreateInput | BookUpdateInput): any {
    return {
      title: book.title,
      author: book.author,
      year: book.year,
      price: book.price,
      description: book.description,
      is_active: book.is_active ?? true,
    };
  }

  static validateBookCreateInput(input: BookCreateInput): void {
    const currentYear = new Date().getFullYear();
    
    if (!input.title || input.title.trim().length === 0) {
      throw new Error('Title is required');
    }
    
    if (!input.author || input.author.trim().length === 0) {
      throw new Error('Author is required');
    }
    
    if (!input.year || input.year < 0 || input.year > currentYear) {
      throw new Error(`Year must be between 0 and ${currentYear}`);
    }
    
    if (!input.price || input.price < 0) {
      throw new Error('Price must be a positive number');
    }
    
    if (input.title.length > 255) {
      throw new Error('Title must be less than 255 characters');
    }
    
    if (input.author.length > 255) {
      throw new Error('Author must be less than 255 characters');
    }
  }
}
