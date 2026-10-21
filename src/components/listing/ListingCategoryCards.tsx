export type ListingCategory = {
  value: string;
  label: string;
  count: number;
  image?: string;
};

type Props = {
  categories: ListingCategory[];
  totalCount: number;
  selectedCategory: string;
  onSelect: (category: string) => void;
  allLabel?: string;
};

function ListingCategoryCards({ categories, totalCount, selectedCategory, onSelect, allLabel = "Todos" }: Props) {
  return (
    <section className="listing-categories" aria-label="Explorar por categoría">
      <div className="listing-categories__heading"><h2>Explora por categoría</h2></div>
      <div className="listing-categories__grid">
      <button
        className={`listing-category-card${selectedCategory === "Todas" ? " listing-category-card--active" : ""}`}
        type="button"
        aria-pressed={selectedCategory === "Todas"}
        onClick={() => onSelect("Todas")}
      >
        <span className="listing-category-card__visual listing-category-card__visual--all" aria-hidden="true">✦</span>
        <span className="listing-category-card__label">{allLabel}</span>
        <strong>{totalCount}</strong>
      </button>
      {categories.map((category) => (
        <button
          key={category.value}
          className={`listing-category-card${selectedCategory === category.value ? " listing-category-card--active" : ""}`}
          type="button"
          aria-pressed={selectedCategory === category.value}
          onClick={() => onSelect(category.value)}
        >
          <span className="listing-category-card__visual">
            <span aria-hidden="true">{category.label.slice(0, 1)}</span>
            {category.image && <img src={category.image} alt="" loading="lazy" onError={(event) => { event.currentTarget.hidden = true; }} />}
          </span>
          <span className="listing-category-card__label">{category.label}</span>
          <strong>{category.count}</strong>
        </button>
      ))}
      </div>
    </section>
  );
}

export default ListingCategoryCards;
