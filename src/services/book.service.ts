import db from '../db';
import { Book, BookCreateInput, BookUpdateInput, BookQueryParams, PaginatedResponse } from '../types';
import { BookEntity } from '../entities/book.entity';

export class BookService {
  async findAll(queryParams: BookQueryParams = {}): Promise<PaginatedResponse<Book>> {
    const {
      page = 1,
      limit = 10,
      search,
      year,
      author,
      is_active = true,
      sort_by = 'title',
      sort_order = 'asc',
    } = queryParams;

    const offset = (page - 1) * limit;

    let query = `
      SELECT * FROM t_book 
      WHERE is_active = $1
    `;
    const params: any[] = [is_active];
    let paramIndex = 2;

    if (search) {
      query += ` AND (title ILIKE $${paramIndex} OR author ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (year) {
      query += ` AND year = $${paramIndex}`;
      params.push(year);
      paramIndex++;
    }

    if (author) {
      query += ` AND author ILIKE $${paramIndex}`;
      params.push(`%${author}%`);
      paramIndex++;
    }

    // Validate sort_by to prevent SQL injection
    const validSortColumns = ['id', 'title', 'author', 'year', 'price'];
    const sortColumn = validSortColumns.includes(sort_by) ? sort_by : 'title';
    const sortDirection = sort_order === 'asc' ? 'ASC' : 'DESC';

    query += ` ORDER BY ${sortColumn} ${sortDirection}`;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const [booksResult, countResult] = await Promise.all([
      db.query(query, params),
      this.getTotalCount(queryParams),
    ]);

    const total = countResult.rows[0].count;
    const totalPages = Math.ceil(total / limit);

    return {
      data: booksResult.rows.map(BookEntity.mapRowToBook),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(total),
        total_pages: totalPages,
      },
    };
  }

  private async getTotalCount(queryParams: BookQueryParams): Promise<{ rows: { count: string }[] }> {
    const { search, year, author, is_active = true } = queryParams;

    let query = `SELECT COUNT(*) FROM t_book WHERE is_active = $1`;
    const params: any[] = [is_active];
    let paramIndex = 2;

    if (search) {
      query += ` AND (title ILIKE $${paramIndex} OR author ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (year) {
      query += ` AND year = $${paramIndex}`;
      params.push(year);
      paramIndex++;
    }

    if (author) {
      query += ` AND author ILIKE $${paramIndex}`;
      params.push(`%${author}%`);
      paramIndex++;
    }

    return db.query(query, params);
  }

  async findById(id: bigint): Promise<Book | null> {
    const query = 'SELECT * FROM t_book WHERE id = $1';
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return BookEntity.mapRowToBook(result.rows[0]);
  }

  async create(bookData: BookCreateInput): Promise<Book> {
    BookEntity.validateBookCreateInput(bookData);

    const query = `
      INSERT INTO t_book (title, author, year, price, description, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const row = BookEntity.mapBookToRow(bookData);
    const params = [row.title, row.author, row.year, row.price, row.description, row.is_active];

    try {
      const result = await db.query(query, params);
      return BookEntity.mapRowToBook(result.rows[0]);
    } catch (error: any) {
      if (error.code === '23505') { // Unique violation
        throw new Error('A book with this title and author already exists');
      }
      throw error;
    }
  }

  async update(id: bigint, bookData: Partial<BookCreateInput>): Promise<Book | null> {
    const existingBook = await this.findById(id);
    if (!existingBook) {
      return null;
    }

    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    Object.entries(bookData).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = $${paramIndex}`);
        params.push(value);
        paramIndex++;
      }
    });

    if (updates.length === 0) {
      return existingBook;
    }

    params.push(id);
    const query = `
      UPDATE t_book 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    try {
      const result = await db.query(query, params);
      return BookEntity.mapRowToBook(result.rows[0]);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new Error('A book with this title and author already exists');
      }
      throw error;
    }
  }

  async delete(id: bigint): Promise<boolean> {
    const query = 'DELETE FROM t_book WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows.length > 0;
  }

  async softDelete(id: bigint): Promise<boolean> {
    const query = 'UPDATE t_book SET is_active = false WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows.length > 0;
  }

  async restore(id: bigint): Promise<boolean> {
    const query = 'UPDATE t_book SET is_active = true WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows.length > 0;
  }
}

export default new BookService();
