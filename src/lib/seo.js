import { useEffect } from "react";

const SITE = "ECS — Elappunkal Enterprises";
const ORIGIN = "https://ecsbuild.in";

function upsert(selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(attrs.property ? "meta" : selector.startsWith("link") ? "link" : "meta");
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
}

/**
 * Sets title, description, canonical and Open Graph tags for a route.
 * Upserts rather than appends, so routes never stack duplicate tags.
 */
export function useSeo({ title, description, path = "/" }) {
  useEffect(() => {
    const fullTitle = path === "/" ? `${title}` : `${title} | ${SITE}`;
    document.title = fullTitle;

    upsert('meta[name="description"]', { name: "description", content: description });
    upsert('link[rel="canonical"]', { rel: "canonical", href: `${ORIGIN}${path}` });
    upsert('meta[property="og:title"]', { property: "og:title", content: fullTitle });
    upsert('meta[property="og:description"]', { property: "og:description", content: description });
    upsert('meta[property="og:url"]', { property: "og:url", content: `${ORIGIN}${path}` });
    upsert('meta[property="og:image"]', { property: "og:image", content: `${ORIGIN}/assets/og.jpg` });
    upsert('meta[name="twitter:title"]', { name: "twitter:title", content: fullTitle });
    upsert('meta[name="twitter:description"]', { name: "twitter:description", content: description });
  }, [title, description, path]);
}
