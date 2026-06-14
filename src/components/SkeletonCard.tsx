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

export interface SkeletonCardProps {
  /** Render the image-shaped block. Defaults to true. */
  withMedia?: boolean;
}

/// Placeholder card shown while a feed page or permalink is loading.
///
/// Avatar circle, two text lines, an optional image-shaped block. Animated via
/// a CSS shimmer keyframe (in the styles bundle) that respects
/// `prefers-reduced-motion`. Marked `aria-hidden`; pair it with a visible
/// "Loading…" label for assistive tech.
export default function SkeletonCard({ withMedia = true }: SkeletonCardProps) {
  return (
    <article className="skeleton-card" aria-hidden="true">
      <header className="skeleton-meta">
        <span className="skeleton-avatar" />
        <span className="skeleton-lines">
          <span className="skeleton-line skeleton-line-md" />
          <span className="skeleton-line skeleton-line-sm" />
        </span>
      </header>
      <div className="skeleton-body">
        <span className="skeleton-line skeleton-line-full" />
        <span className="skeleton-line skeleton-line-full" />
        <span className="skeleton-line skeleton-line-3q" />
      </div>
      {withMedia && <div className="skeleton-media" />}
    </article>
  );
}
