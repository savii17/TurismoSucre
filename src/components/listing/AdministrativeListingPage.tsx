import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { AdministrativeListing } from "../../types/listing";
import ListingCategoryCards from "./ListingCategoryCards";
import ListingPageVisuals, {
  ListingCategoryMap,
  type ListingPageKind,
} from "./ListingPageVisuals";
import ImageWithFallback from "../ImageWithFallback";
import { getImageSet } from "../../data/imageCatalog";
import { useLanguage } from "../../i18n/useLanguage";
import { translateRecordText } from "../../i18n/contentTranslations";

type Props = {
  title: string;
  description: string;
  actionLabel: string;
  items: AdministrativeListing[];
  showDate?: boolean;
  detailPath?: string;
  kind?: ListingPageKind;
  canManage?: boolean;
  onCreate?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string, name: string) => void;
};

const isDisplayable = (value?: string) =>
  Boolean(value?.trim()) &&
  !/(?:no disponible|sin informaci[oó]n|no especificad[oa]|no registrado|pendiente de verificaci[oó]n)/i.test(
    value ?? ""
  );

const pageSize = 8;

export default function AdministrativeListingPage({
  title,
  description,
  actionLabel,
  items,
  showDate,
  detailPath,
  kind,
  canManage = false,
  onCreate,
  onEdit,
  onDelete,
}: Props) {
  const { language, tx } = useLanguage();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [status, setStatus] = useState("Todos");
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () => ["Todas", ...new Set(items.map((item) => item.category))],
    [items]
  );

  const imageCategory =
    kind === "places"
      ? "tourist-place"
      : kind === "accommodations"
        ? "accommodation"
        : "restaurant";

  const contentKind =
    kind === "places"
      ? "tourist-place"
      : kind === "accommodations"
        ? "accommodation"
        : "restaurant";

  const categoryCards = useMemo(
    () =>
      categories.slice(1).map((value) => {
        const matchingItems = items.filter(
          (item) => item.category === value
        );
        const representative = matchingItems[0];

        return {
          value,
          label: translateRecordText(
            contentKind,
            value,
            "category",
            value,
            language
          ),
          count: matchingItems.length,
          imageSet: representative
            ? getImageSet(imageCategory, representative.id, [
                representative.image ?? "",
                ...(representative.images ?? []),
              ])
            : undefined,
        };
      }),
    [categories, contentKind, imageCategory, items, language]
  );

  const normalizedQuery = query.trim().toLocaleLowerCase();

  const visibleItems = items.filter(
    (item) =>
      `${item.name} ${item.category} ${item.location} ${item.description}`
        .toLocaleLowerCase()
        .includes(normalizedQuery) &&
      (category === "Todas" || item.category === category) &&
      (status === "Todos" || item.status === status)
  );

  const pageCount = Math.max(
    1,
    Math.ceil(visibleItems.length / pageSize)
  );

  const safePage = Math.min(page, pageCount);

  const paginatedItems = visibleItems.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const resetFilters = () => {
    setQuery("");
    setCategory("Todas");
    setStatus("Todos");
    setPage(1);
  };

  return (
    <section
      className={`admin-listing${kind ? ` admin-listing--${kind}` : ""}`}
      aria-labelledby="listing-title"
    >
      {kind && <ListingPageVisuals kind={kind} />}

      <ListingCategoryCards
        categories={categoryCards}
        totalCount={items.length}
        selectedCategory={category}
        onSelect={(value) => {
          setCategory(value);
          setPage(1);
        }}
        allLabel={tx("Todos")}
        imageCategory={imageCategory}
      />

      <div className="listing-results-layout">
        <div className="listing-results-main">
          <div className="admin-listing__heading">
            <div>
              <p className="eyebrow">
                {tx(kind ? "Selección destacada" : "Gestión turística")}
              </p>

              <h1 id="listing-title">
                {kind
                  ? `${tx(title)} ${tx("destacados")}`
                  : tx(title)}
              </h1>

              <p>{tx(description)}</p>
            </div>

            {canManage && onCreate && (
              <button
                className="admin-button"
                type="button"
                onClick={onCreate}
              >
                + {tx(actionLabel)}
              </button>
            )}
          </div>

          <div
            className="admin-filters"
            aria-label={`${tx("Filtros de")} ${tx(title)}`}
          >
            <label>
              <span className="sr-only">{tx("Buscar")}</span>

              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder={tx("Buscar por nombre o ubicación")}
              />
            </label>

            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                setPage(1);
              }}
              aria-label={tx("Filtrar por categoría")}
            >
              {categories.map((value) => (
                <option key={value} value={value}>
                  {value === "Todas"
                    ? tx("Todas")
                    : translateRecordText(
                        contentKind,
                        value,
                        "category",
                        value,
                        language
                      )}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              aria-label={tx("Filtrar por estado")}
            >
              <option value="Todos">{tx("Todos")}</option>
              <option value="ACTIVO">{tx("ACTIVO")}</option>
              <option value="INACTIVO">{tx("INACTIVO")}</option>
            </select>

            {showDate && (
              <input
                type="date"
                aria-label={tx("Filtrar por fecha")}
              />
            )}

            {(query || category !== "Todas" || status !== "Todos") && (
              <button
                className="admin-filter-button"
                type="button"
                onClick={resetFilters}
              >
                {tx("Limpiar filtros")}
              </button>
            )}
          </div>

          <p className="admin-listing__count" aria-live="polite">
            {tx(`${visibleItems.length} registros encontrados`)}
          </p>

          <div className="admin-cards">
            {paginatedItems.map((item) => {
              const imageSet = getImageSet(
                imageCategory,
                item.id,
                [item.image ?? "", ...(item.images ?? [])]
              );

              const statusLabel = translateRecordText(
                contentKind,
                item.id,
                "status",
                item.status,
                language
              );

              const categoryLabel = translateRecordText(
                contentKind,
                item.id,
                "category",
                item.category,
                language
              );

              const descriptionLabel = translateRecordText(
                contentKind,
                item.id,
                "description",
                item.description,
                language
              );

              const locationLabel = translateRecordText(
                contentKind,
                item.id,
                "location",
                item.location,
                language
              );

              const dateLabel = item.date
                ? new Date(item.date).toLocaleDateString(
                    language === "es" ? "es-BO" : "en-US"
                  )
                : item.date;

              return (
                <article className="admin-card" key={item.id}>
                  <div className="admin-card__media">
                    <ImageWithFallback
                      imageSet={imageSet}
                      category={imageCategory}
                      alt={
                        imageSet.main?.alt ??
                        `${item.name} in Sucre, Bolivia`
                      }
                    />

                    <b
                      className={`status-badge status-badge--${item.status.toLowerCase()}`}
                    >
                      {statusLabel}
                    </b>
                  </div>

                  <div className="admin-card__body">
                    <p className="admin-card__category">
                      {categoryLabel}
                    </p>

                    <h2>{item.name}</h2>

                    {showDate && isDisplayable(item.date) && (
                      <p className="admin-card__date">
                        ◷ {dateLabel}
                      </p>
                    )}

                    {isDisplayable(item.location) && (
                      <p className="admin-card__location">
                        ⌖ {locationLabel}
                      </p>
                    )}

                    {isDisplayable(item.description) && (
                      <p className="admin-card__description">
                        {descriptionLabel}
                      </p>
                    )}

                    {item.services?.length ? (
                      <div className="admin-card__services">
                        {item.services.slice(0, 3).map((service) => (
                          <span key={service}>
                            {translateRecordText(
                              contentKind,
                              item.id,
                              "services",
                              service,
                              language
                            )}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="admin-card__meta">
                      {item.rating != null && (
                        <span>
                          ★ {item.rating.toFixed(1)}{" "}
                          {item.reviews != null && (
                            <small>
                              ({item.reviews} {tx("opiniones")})
                            </small>
                          )}
                        </span>
                      )}

                      {item.price && (
                        <strong>
                          {translateRecordText(
                            contentKind,
                            item.id,
                            "price",
                            item.price,
                            language
                          )}
                        </strong>
                      )}
                    </div>

                    {detailPath ? (
                      <Link
                        className="admin-card__details"
                        to={`${detailPath}/${encodeURIComponent(item.id)}`}
                      >
                        {tx("Ver detalles")} <span>→</span>
                      </Link>
                    ) : (
                      <button
                        className="admin-card__details"
                        type="button"
                      >
                        {tx("Ver detalles")} <span>→</span>
                      </button>
                    )}

                    {canManage && onEdit && onDelete && (
                      <div className="admin-card__management">
                        <button
                          type="button"
                          onClick={() => onEdit(item.id)}
                        >
                          {tx("Editar")}
                        </button>

                        <button
                          className="danger"
                          type="button"
                          onClick={() => onDelete(item.id, item.name)}
                        >
                          {tx("Eliminar")}
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {visibleItems.length === 0 && (
            <p className="admin-empty">
              {tx(
                "No se encontraron registros con los filtros seleccionados."
              )}
            </p>
          )}

          {visibleItems.length > 0 && (
            <nav
              className="pagination"
              aria-label={tx("Paginación")}
            >
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() =>
                  setPage((current) => Math.max(1, current - 1))
                }
              >
                ← {tx("Anterior")}
              </button>

              {Array.from(
                { length: pageCount },
                (_, index) => index + 1
              ).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  className={safePage === pageNumber ? "active" : ""}
                  aria-current={
                    safePage === pageNumber ? "page" : undefined
                  }
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                type="button"
                disabled={safePage === pageCount}
                onClick={() =>
                  setPage((current) =>
                    Math.min(pageCount, current + 1)
                  )
                }
              >
                {tx("Siguiente")} →
              </button>
            </nav>
          )}
        </div>

        {kind && <ListingCategoryMap kind={kind} items={items} />}
      </div>
    </section>
  );
}