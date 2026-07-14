import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import ProductFilters, {
  PRICE_OPTIONS,
  RATING_OPTIONS,
} from "../../components/ProductFilters/ProductFilters";
import { CATEGORIES, FEATURES, PRODUCTS } from "../../data/products";
import { buildSrcSet, getResponsiveImage } from "../../utils/image";
import "./HomePage.css";

export const PRODUCT_STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  ERROR: "error",
  EMPTY: "empty",
};

export const NEWSLETTER_STATUS = {
  IDLE: "idle",
  SUCCESS: "success",
  ERROR: "error",
};

const CATEGORY_LABELS = CATEGORIES.map((category) => category.label);

const STATS = [
  { value: "40+", label: "Products in stock" },
  { value: "50k+", label: "Happy customers" },
  { value: "4.8/5", label: "Average rating" },
  { value: "24/7", label: "Customer support" },
];

const TESTIMONIALS = [
  {
    quote:
      "The quality blew me away for the price. My order arrived two days early and the packaging was gorgeous.",
    name: "Ava Thompson",
    role: "Verified buyer",
    rating: 5,
  },
  {
    quote:
      "Shopzy is my go-to for gifts now. Easy checkout, fast shipping, and the returns process is completely painless.",
    name: "Marcus Lee",
    role: "Verified buyer",
    rating: 5,
  },
  {
    quote:
      "Great range across fashion and tech. The product photos are accurate and customer support actually replies fast.",
    name: "Priya Sharma",
    role: "Verified buyer",
    rating: 4,
  },
];

function FeaturedProducts({ products, status, onAddToCart }) {
  if (status === PRODUCT_STATUS.LOADING) {
    return (
      <p className="home-products__status" role="status">
        Loading products…
      </p>
    );
  }

  if (status === PRODUCT_STATUS.ERROR) {
    return (
      <p
        className="home-products__status home-products__status--error"
        role="alert"
      >
        Something went wrong while loading products. Please try again later.
      </p>
    );
  }

  if (status === PRODUCT_STATUS.EMPTY || products.length === 0) {
    return (
      <p className="home-products__status" role="status">
        No products found. Check back soon for new arrivals.
      </p>
    );
  }

  return (
    <div className="home-products">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

function HomePage({
  products = PRODUCTS,
  productsStatus = PRODUCT_STATUS.IDLE,
  onAddToCart,
  onSubscribe,
}) {
  const [newsletterStatus, setNewsletterStatus] = useState(
    NEWSLETTER_STATUS.IDLE,
  );
  const [newsletterError, setNewsletterError] = useState("");
  const [viewAll, setViewAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState("featured");
  const [price, setPrice] = useState("all");
  const [rating, setRating] = useState("all");
  const [onSale, setOnSale] = useState(false);

  const filteredProducts = useMemo(() => {
    let list = products;

    if (activeCategory !== "all") {
      list = list.filter((product) => product.category === activeCategory);
    }

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      list = list.filter((product) =>
        product.name.toLowerCase().includes(query),
      );
    }

    const priceOption = PRICE_OPTIONS.find((option) => option.value === price);
    if (priceOption && priceOption.value !== "all") {
      list = list.filter(
        (product) =>
          product.price >= priceOption.min && product.price < priceOption.max,
      );
    }

    const ratingOption = RATING_OPTIONS.find(
      (option) => option.value === rating,
    );
    if (ratingOption && ratingOption.value !== "all") {
      list = list.filter((product) => product.rating >= ratingOption.min);
    }

    if (onSale) {
      list = list.filter(
        (product) => Boolean(product.originalPrice) || product.badge === "Sale",
      );
    }

    const sorted = [...list];
    if (sort === "price-asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      sorted.sort((a, b) => b.rating - a.rating);
    }

    return sorted;
  }, [products, activeCategory, searchQuery, sort, price, rating, onSale]);

  const displayedProducts = viewAll
    ? filteredProducts
    : filteredProducts.slice(0, 8);

  const handleResetFilters = () => {
    setActiveCategory("all");
    setSearchQuery("");
    setSort("featured");
    setPrice("all");
    setRating("all");
    setOnSale(false);
  };

  const handleSubscribe = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();

    if (!email) {
      setNewsletterError("Email is required.");
      setNewsletterStatus(NEWSLETTER_STATUS.ERROR);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNewsletterError("Please enter a valid email address.");
      setNewsletterStatus(NEWSLETTER_STATUS.ERROR);
      return;
    }

    try {
      if (onSubscribe) {
        await onSubscribe(email);
      }
      setNewsletterError("");
      setNewsletterStatus(NEWSLETTER_STATUS.SUCCESS);
      event.currentTarget.reset();
    } catch {
      setNewsletterError("Unable to subscribe right now. Please try again.");
      setNewsletterStatus(NEWSLETTER_STATUS.ERROR);
    }
  };

  const handleViewAll = (event) => {
    event.preventDefault();
    setViewAll((prev) => !prev);
  };

  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero__content">
          <p className="home-hero__eyebrow">New season arrivals</p>
          <h1 className="home-hero__title">Style meets smart shopping</h1>
          <p className="home-hero__text">
            Discover curated fashion for women and men, plus the latest
            electronics — all in one place, with free shipping and 30-day
            returns.
          </p>
          <div className="home-hero__actions">
            <a
              href="#featured"
              className="home-hero__btn home-hero__btn--primary"
            >
              Shop now
            </a>
            <a
              href="#categories"
              className="home-hero__btn home-hero__btn--secondary"
            >
              Browse categories
            </a>
          </div>
        </div>
      </section>

      <section className="home-features" aria-label="Store benefits">
        <ul className="home-features__list">
          {FEATURES.map(({ label, detail }) => (
            <li key={label} className="home-features__item">
              <strong>{label}</strong>
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-stats" aria-label="Shopzy by the numbers">
        <div className="home-stats__inner">
          {STATS.map(({ value, label }) => (
            <div key={label} className="home-stat">
              <span className="home-stat__value">{value}</span>
              <span className="home-stat__label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="categories" className="home-section">
        <div className="home-section__header">
          <h2 className="home-section__title">Shop by category</h2>
          <p className="home-section__subtitle">Find what you love, faster</p>
        </div>

        <div className="home-categories">
          {CATEGORIES.map(({ id, label, description, bg, image }) => (
            <Link
              key={id}
              id={id}
              to={`/${id}`}
              className="home-category"
              style={{ background: bg }}
            >
              {image && (
                <img
                  src={getResponsiveImage(image, { width: 600 }).src}
                  srcSet={buildSrcSet(image, [400, 600, 800])}
                  sizes="(max-width: 700px) 100vw, 33vw"
                  alt={label}
                  className="home-category__image"
                  loading="lazy"
                  decoding="async"
                />
              )}
              <span className="home-category__label">{label}</span>
              <span className="home-category__desc">{description}</span>
              <span className="home-category__cta">
                Shop {label.toLowerCase()} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="featured" className="home-section">
        <div className="home-section__header home-section__header--row">
          <div>
            <h2 className="home-section__title">Featured products</h2>
            <p className="home-section__subtitle">
              Hand-picked bestsellers this week
            </p>
          </div>
          {filteredProducts.length > 8 && (
            <a
              href="#featured"
              className="home-section__link"
              onClick={handleViewAll}
            >
              {viewAll ? "View less" : "View all"}
            </a>
          )}
        </div>

        {productsStatus === PRODUCT_STATUS.IDLE && (
          <div className="home-products__controls">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <ProductFilters
              categories={CATEGORY_LABELS}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              sort={sort}
              onSortChange={setSort}
              price={price}
              onPriceChange={setPrice}
              rating={rating}
              onRatingChange={setRating}
              onSale={onSale}
              onOnSaleChange={setOnSale}
              onReset={handleResetFilters}
              resultCount={filteredProducts.length}
            />
          </div>
        )}

        <FeaturedProducts
          products={displayedProducts}
          status={productsStatus}
          onAddToCart={onAddToCart}
        />
      </section>

      <section className="home-section" aria-label="Customer reviews">
        <div className="home-section__header">
          <h2 className="home-section__title">Loved by shoppers</h2>
          <p className="home-section__subtitle">
            Real reviews from the Shopzy community
          </p>
        </div>

        <div className="home-testimonials">
          {TESTIMONIALS.map(({ quote, name, role, rating }) => (
            <figure key={name} className="home-testimonial">
              <div
                className="home-testimonial__stars"
                aria-label={`Rated ${rating} out of 5`}
              >
                <span aria-hidden="true">
                  {"★".repeat(rating)}
                  {"☆".repeat(5 - rating)}
                </span>
              </div>
              <blockquote className="home-testimonial__quote">
                “{quote}”
              </blockquote>
              <figcaption className="home-testimonial__author">
                <span className="home-testimonial__name">{name}</span>
                <span className="home-testimonial__role">{role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="home-promo">
        <div className="home-promo__content">
          <p className="home-promo__eyebrow">Limited time offer</p>
          <h2 className="home-promo__title">Get 20% off your first order</h2>
          <p className="home-promo__text">
            Sign up for exclusive deals on fashion and tech. Use code{" "}
            <code>WELCOME20</code> at checkout.
          </p>

          {newsletterStatus === NEWSLETTER_STATUS.SUCCESS ? (
            <p className="home-promo__success" role="status">
              Thanks for subscribing! Check your inbox for your welcome offer.
            </p>
          ) : (
            <form
              className="home-promo__form"
              onSubmit={handleSubscribe}
              noValidate
            >
              <div className="home-promo__field">
                <input
                  type="email"
                  name="email"
                  className="home-promo__input"
                  placeholder="Enter your email"
                  aria-label="Email address"
                  aria-invalid={newsletterStatus === NEWSLETTER_STATUS.ERROR}
                  aria-describedby={
                    newsletterError ? "newsletter-error" : undefined
                  }
                  required
                />
                {newsletterError && (
                  <p
                    id="newsletter-error"
                    className="home-promo__error"
                    role="alert"
                  >
                    {newsletterError}
                  </p>
                )}
              </div>
              <button type="submit" className="home-promo__submit">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
