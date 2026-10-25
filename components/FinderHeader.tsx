// Compact page header on tartan with search, category chips and a count sticker.
// Used by the recipes page and the shop; the parent owns the search state.
type Props = {
  copy: { kicker: string; title: string; body: string; search: string; placeholder: string; countLabel: string };
  query: string;
  onQuery: (query: string) => void;
  categories: { name: string; count: number }[];
  category: string;
  onCategory: (category: string) => void;
  shown: number;
};

export default function FinderHeader({ copy, query, onQuery, categories, category, onCategory, shown }: Props) {
  return (
    <header className="t-tartan t-finder">
      <div className="t-finder-panel" data-intro>
        <div className="t-finder-copy">
          <p className="t-badge">{copy.kicker}</p>
          <h1 className="t-display t-finder-title">{copy.title}</h1>
          <p className="t-muted">{copy.body}</p>
        </div>

        <div className="t-finder-search">
          <label className="t-search-field">
            <span className="t-sr">{copy.search}</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input type="search" value={query} placeholder={copy.placeholder} onChange={(e) => onQuery(e.target.value)} />
          </label>
          <div className="t-filters t-filters--small" role="group" aria-label={copy.kicker}>
            {categories.map((c) => (
              <button key={c.name} type="button" aria-pressed={category === c.name} onClick={() => onCategory(c.name)}>
                {c.name}
                <span className="t-filter-count">{c.count}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="t-finder-sticker" aria-live="polite" data-pop>
          <span className="t-display">{shown}</span>
          {copy.countLabel}
        </p>
      </div>
    </header>
  );
}
