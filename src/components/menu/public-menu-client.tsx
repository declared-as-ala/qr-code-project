"use client";

import { useMemo, useState } from "react";
import "./public-menu-premium.css";

type Product = { _id: string; name: string; description?: string; price: number; badge?: string; isAvailable: boolean; categoryId: string; image?: string };
type Category = { _id: string; name: string };

export function PublicMenuClient({
  restaurant,
  categories,
  products,
}: {
  restaurant: { name: string; logo?: string; coverImage?: string; phone?: string; address?: string; primaryColor?: string };
  categories: Category[];
  products: Product[];
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string | null>(categories[0]?._id ?? null);
  const [toastVisible, setToastVisible] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q) || (p.description ?? "").toLowerCase().includes(q));
  }, [products, query]);

  const grouped = useMemo(
    () =>
      categories.map((category) => ({
        category,
        products: filtered.filter((p) => p.categoryId === category._id),
      })),
    [categories, filtered]
  );

  const visibleCount = grouped.reduce((acc, group) => acc + group.products.length, 0);

  function triggerToast() {
    setToastVisible(true);
    window.clearTimeout((window as { __menuToast?: number }).__menuToast);
    (window as { __menuToast?: number }).__menuToast = window.setTimeout(() => setToastVisible(false), 1800);
  }

  const phoneHref = restaurant.phone ? `tel:${restaurant.phone}` : "#";
  const whatsappHref = restaurant.phone ? `https://wa.me/${restaurant.phone.replace(/\D/g, "")}` : "#";

  return (
    <main className="premium-menu">
      <div className={`menu-toast ${toastVisible ? "show" : ""}`}>Article ajoute a votre selection ✨</div>

      <div className="app-shell">
        <header className="top-bar" aria-label="Navigation principale">
          <div className="brand">
            <div className="brand-mark" aria-hidden="true">
              ☕
            </div>
            <div>
              <div className="brand-title">{restaurant.name || "ENSEIGNE"}</div>
              <div className="brand-subtitle">Cafe & Restaurant</div>
            </div>
          </div>
          <nav className="nav-actions" aria-label="Actions rapides">
            <a className="pill-btn" href="#menu">
              Menu
            </a>
            <a className="pill-btn" href="#contact">
              Contact
            </a>
            <a className="pill-btn gold" href={whatsappHref}>
              Commander
            </a>
          </nav>
        </header>

        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-content">
            <div>
              <div className="status-row">
                <div className="status-chip">
                  <span className="status-dot" />
                  Ouvert aujourd hui
                </div>
                <div className="status-chip">Menu digital premium</div>
              </div>

              <h1 id="hero-title">
                Votre pause
                <span>merite mieux.</span>
              </h1>
              <p>Decouvrez notre carte digitale, pensee pour une experience rapide, elegante et toujours a jour.</p>

              <div className="hero-actions">
                <a href="#menu" className="pill-btn gold">
                  Voir le menu
                </a>
                <a href={phoneHref} className="pill-btn">
                  Appeler l etablissement
                </a>
              </div>
            </div>

            <div className="hero-stats" aria-label="Informations du restaurant">
              <div className="stat-card">
                <div className="stat-value">4.8/5</div>
                <div className="stat-label">Note moyenne des clients</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">+{products.length}</div>
                <div className="stat-label">Articles disponibles</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">2 min</div>
                <div className="stat-label">Pour parcourir la carte</div>
              </div>
            </div>
          </div>

          <aside className="floating-qr" aria-label="QR code decoratif">
            <div className="qr-inner">
              <div className="fake-qr" aria-hidden="true" />
            </div>
            <div className="qr-caption">
              <span>Scan Menu</span>
              <span>Table 08</span>
            </div>
          </aside>
        </section>

        <div className="mobile-categories" aria-label="Categories rapides">
          {categories.map((category) => (
            <a key={`mobile-${category._id}`} href={`#cat-${category._id}`}>
              {category.name}
            </a>
          ))}
        </div>

        <section id="menu" className="section menu-layout">
          <aside className="menu-sidebar">
            <div className="search-box">
              <span>⌕</span>
              <input id="searchInput" type="search" placeholder="Rechercher un article..." value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>

            <div className="sidebar-title">Categories</div>
            <div className="category-list">
              {categories.map((c) => (
                <a key={c._id} className={`category-btn ${active === c._id ? "active" : ""}`} href={`#cat-${c._id}`} onClick={() => setActive(c._id)}>
                  <span>{c.name}</span>
                  <small>{grouped.find((g) => g.category._id === c._id)?.products.length ?? 0}</small>
                </a>
              ))}
            </div>

            <div className="info-card">
              <strong>Menu toujours a jour</strong>
              <p>Les prix, disponibilites et nouveautes sont synchronises directement depuis le dashboard de l etablissement.</p>
            </div>
          </aside>

          <section className="menu-main" aria-label="Menu du restaurant">
            <div className="menu-toolbar">
              <div>
                <h2>Carte du jour</h2>
                <p>Une selection raffinee de cafes, plats gourmands et douceurs preparees avec soin.</p>
              </div>
              <div className="service-badge">
                Service actif
                <small>Derniere mise a jour: il y a 3 min</small>
              </div>
            </div>

            <div className="no-results" style={{ display: visibleCount === 0 ? "block" : "none" }}>
              <h3>Aucun resultat</h3>
              <p>Essayez un autre mot-cle ou explorez les categories du menu.</p>
            </div>

            {grouped
              .filter((group) => (active ? group.category._id === active : true))
              .map((group) =>
                group.products.length ? (
                  <article id={`cat-${group.category._id}`} className="category-section" data-category key={group.category._id}>
                    <div className="category-heading">
                      <h3>{group.category.name}</h3>
                      <span>{group.products.length} articles</span>
                    </div>
                    <div className="product-grid">
                      {group.products.map((p) => (
                        <div key={p._id} className={`product-card ${!p.isAvailable ? "sold-out" : ""}`} data-name={`${p.name} ${p.description ?? ""}`.toLowerCase()}>
                          <div className="product-image">
                            {p.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={p.image} alt={p.name} />
                            ) : (
                              <div className="product-image-placeholder" />
                            )}
                          </div>
                          <div className="product-content">
                            <div className="product-topline">
                              {p.badge ? <span className="badge">{p.badge}</span> : <span className="badge soft">Selection</span>}
                            </div>
                            <h4>{p.name}</h4>
                            <p>{p.description || "Recette de la maison."}</p>
                            <div className="product-footer">
                              <div className="price">
                                {p.price.toFixed(3)} <small>DT</small>
                              </div>
                              <button className="add-btn" aria-label="Ajouter" onClick={triggerToast}>
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                ) : null
              )}
          </section>
        </section>
      </div>

      <footer id="contact" className="bottom-bar" aria-label="Contact rapide">
        <div className="bottom-bar-info">
          <div className="mini-logo">☕</div>
          <div>
            <strong>Besoin d aide ?</strong>
            <small>{restaurant.address || "Appelez ou envoyez un message au serveur"}</small>
          </div>
        </div>
        <a className="pill-btn gold" href={whatsappHref}>
          WhatsApp
        </a>
      </footer>
    </main>
  );
}
