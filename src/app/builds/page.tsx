import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { classData } from '@/lib/constants/classes';
import type { D4Class } from '@/lib/types/classes';
import type { Build } from '@/lib/types/builds';
import BuildCard from '@/components/builds/BuildCard';

const CLASS_FILTERS = Object.values(classData).map(c => ({
  slug: c.meta.slug,
  name: c.meta.name,
  abbr: c.meta.abbr,
  colorHex: c.meta.colorHex,
}));

const BUILDS_PER_PAGE = 20;

interface Props {
  searchParams: Promise<{
    class?: string;
    sort?: string;
    q?: string;
    page?: string;
  }>;
}

export const metadata = {
  title: 'Community Builds',
  description: 'Browse, vote, and share Diablo 4 Season 13 builds from the community. Filter by class and sort by popularity.',
};

export default async function BuildFeedPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createClient();

  const classFilter = params.class as D4Class | undefined;
  const sort = params.sort === 'recent' ? 'recent' : 'votes';
  const search = params.q?.trim() ?? '';
  const page = Math.max(1, parseInt(params.page ?? '1') || 1);
  const offset = (page - 1) * BUILDS_PER_PAGE;

  // Build query
  let query = supabase
    .from('builds')
    .select('*, profiles:user_id(display_name, battletag)', { count: 'exact' })
    .eq('is_public', true);

  if (classFilter && classData[classFilter]) {
    query = query.eq('class', classFilter);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,tags.cs.{${search}}`);
  }

  if (sort === 'recent') {
    query = query.order('created_at', { ascending: false });
  } else {
    query = query.order('vote_count', { ascending: false }).order('created_at', { ascending: false });
  }

  query = query.range(offset, offset + BUILDS_PER_PAGE - 1);

  const { data: builds, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / BUILDS_PER_PAGE);

  // Build query string helper
  const buildUrl = (overrides: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const classVal = overrides.class !== undefined ? overrides.class : classFilter;
    const sortVal = overrides.sort !== undefined ? overrides.sort : sort;
    const qVal = overrides.q !== undefined ? overrides.q : search;
    const pageVal = overrides.page !== undefined ? overrides.page : (overrides.class !== undefined || overrides.sort !== undefined || overrides.q !== undefined ? '1' : String(page));

    if (classVal) p.set('class', classVal);
    if (sortVal && sortVal !== 'votes') p.set('sort', sortVal);
    if (qVal) p.set('q', qVal);
    if (pageVal && pageVal !== '1') p.set('page', pageVal);

    const qs = p.toString();
    return `/builds${qs ? `?${qs}` : ''}`;
  };

  return (
    <div className="build-feed">
      <div className="container">
        <h1 className="build-feed-title">Community Builds</h1>

        {/* Filters */}
        <div className="build-feed-controls">
          <div className="build-feed-filters">
            <Link
              href={buildUrl({ class: undefined })}
              className={`build-feed-filter ${!classFilter ? 'build-feed-filter-active' : ''}`}
            >
              All
            </Link>
            {CLASS_FILTERS.map(c => (
              <Link
                key={c.slug}
                href={buildUrl({ class: classFilter === c.slug ? undefined : c.slug })}
                className={`build-feed-filter ${classFilter === c.slug ? 'build-feed-filter-active' : ''}`}
                style={{
                  borderColor: classFilter === c.slug ? c.colorHex : undefined,
                  color: classFilter === c.slug ? c.colorHex : undefined,
                }}
              >
                {c.abbr}
              </Link>
            ))}
          </div>

          <div className="build-feed-sort">
            <Link
              href={buildUrl({ sort: 'votes' })}
              className={`build-feed-sort-btn ${sort === 'votes' ? 'build-feed-sort-active' : ''}`}
            >
              Top
            </Link>
            <Link
              href={buildUrl({ sort: 'recent' })}
              className={`build-feed-sort-btn ${sort === 'recent' ? 'build-feed-sort-active' : ''}`}
            >
              New
            </Link>
          </div>
        </div>

        {/* Search */}
        <form className="build-feed-search" action="/builds" method="GET">
          {classFilter && <input type="hidden" name="class" value={classFilter} />}
          {sort !== 'votes' && <input type="hidden" name="sort" value={sort} />}
          <input
            type="text"
            name="q"
            defaultValue={search}
            placeholder="Search builds..."
            className="build-editor-input build-feed-search-input"
          />
          <button type="submit" className="build-feed-search-btn">Search</button>
        </form>

        {/* Results */}
        {(builds ?? []).length === 0 ? (
          <p className="profile-empty" style={{ marginTop: '24px' }}>
            {search ? `No builds found for "${search}".` : 'No public builds yet.'}
          </p>
        ) : (
          <div className="build-feed-list">
            {(builds ?? []).map((build: Build & { profiles?: { display_name: string } }) => (
              <BuildCard
                key={build.id}
                build={{
                  ...build,
                  author: build.profiles ? { display_name: build.profiles.display_name } : undefined,
                }}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            {page > 1 && (
              <Link href={buildUrl({ page: String(page - 1) })} className="pagination-btn">
                &larr; Prev
              </Link>
            )}
            <span className="pagination-info">Page {page} of {totalPages}</span>
            {page < totalPages && (
              <Link href={buildUrl({ page: String(page + 1) })} className="pagination-btn">
                Next &rarr;
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
