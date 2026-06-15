/*  This file is part of @cavebatsofware/riposte-design-system
 *  Copyright (C) 2026 Grant DeFayette
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, version 3 of the License (GPL-3.0-only).
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/gpl-3.0.html>.
 */
import type { Key, ReactNode } from "react";

export interface TableColumn<Row> {
  /** Property on the row passed to `render`'s first arg, and the cell key. */
  key: string;
  header: ReactNode;
  /** Custom cell renderer; defaults to the raw `row[key]` value. */
  render?: (value: unknown, row: Row) => ReactNode;
}

export interface TablePagination {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/// Optional UI strings. Precedence is prop > built-in English default, so a
/// consumer localizes by passing values (e.g. from an i18n bundle) or leaves
/// them for English.
export interface TableLabels {
  loading?: string;
  empty?: string;
  first?: string;
  previous?: string;
  next?: string;
  last?: string;
  /** Page indicator text builder. */
  pageInfo?: (page: number, totalPages: number) => string;
}

export interface TableProps<Row> {
  columns: TableColumn<Row>[];
  data: Row[];
  /** Unique row key. Defaults to `row.id`. */
  getRowKey?: (row: Row) => Key;
  /** Extra class for a row (e.g. to flag a failed or current-user row). */
  getRowClassName?: (row: Row) => string;
  loading?: boolean;
  /** Convenience override for `labels.empty` (kept for back-compat). */
  emptyMessage?: string;
  pagination?: TablePagination;
  labels?: TableLabels;
}

const DEFAULTS: Required<Omit<TableLabels, "pageInfo">> & {
  pageInfo: (page: number, totalPages: number) => string;
} = {
  loading: "Loading…",
  empty: "No data available",
  first: "First",
  previous: "Previous",
  next: "Next",
  last: "Last",
  pageInfo: (page, totalPages) => `Page ${page} of ${totalPages}`,
};

/// Token-styled data table with optional pagination. Generic over the row type:
/// `columns[].render` receives the typed row. Header/empty/pagination strings
/// are overridable label props (English defaults).
export default function Table<Row extends object>({
  columns,
  data,
  getRowKey = (row: Row) => (row as { id?: Key }).id ?? JSON.stringify(row),
  getRowClassName,
  loading = false,
  emptyMessage,
  pagination,
  labels,
}: TableProps<Row>) {
  const l = { ...DEFAULTS, ...labels };
  const empty = emptyMessage ?? l.empty;

  if (loading) {
    return <div className="rds-table-loading">{l.loading}</div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="rds-table-empty">
        <p>{empty}</p>
      </div>
    );
  }

  return (
    <div className="rds-table-container">
      <table className="rds-data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={getRowKey(row)}
              className={getRowClassName ? getRowClassName(row) : undefined}
            >
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render
                    ? col.render((row as Record<string, unknown>)[col.key], row)
                    : ((row as Record<string, ReactNode>)[col.key] ?? null)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {pagination && pagination.totalPages > 1 && (
        <div className="rds-pagination">
          <button
            type="button"
            onClick={() => pagination.onPageChange(1)}
            disabled={pagination.page === 1}
            className="rds-pagination-btn"
          >
            {l.first}
          </button>
          <button
            type="button"
            onClick={() => pagination.onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="rds-pagination-btn"
          >
            {l.previous}
          </button>
          <span className="rds-pagination-info">
            {l.pageInfo(pagination.page, pagination.totalPages)}
          </span>
          <button
            type="button"
            onClick={() => pagination.onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="rds-pagination-btn"
          >
            {l.next}
          </button>
          <button
            type="button"
            onClick={() => pagination.onPageChange(pagination.totalPages)}
            disabled={pagination.page === pagination.totalPages}
            className="rds-pagination-btn"
          >
            {l.last}
          </button>
        </div>
      )}
    </div>
  );
}
