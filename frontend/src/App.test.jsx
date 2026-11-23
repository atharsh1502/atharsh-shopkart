// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App.jsx";
import { formatPrice } from "./format.js";

const products = [
  { id: 1, name: "Earbuds One", category: "Audio", brand: "Sound", price: 1299, rating: 4.2, stock: 2, description: "Wireless earbuds", tags: ["wireless"] },
  { id: 2, name: "Running Shoe", category: "Footwear", brand: "Stride", price: 3695, rating: 4.8, stock: 4, description: "Comfortable running shoes", tags: ["running"] },
];

function jsonResponse(data, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => data };
}

function productControl(container, name, selector) {
  const card = [...container.querySelectorAll(".product-card")]
    .find((item) => item.querySelector("h3").textContent === name);
  return card?.querySelector(selector);
}

describe("ShopKart storefront", () => {
  let container;
  let root;

  beforeEach(async () => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(products)));
    await act(async () => {
      root.render(<App />);
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.unstubAllGlobals();
  });

  it("formats prices as Indian rupees", () => {
    expect(formatPrice(1299)).toContain("1,299");
    expect(formatPrice(1299)).toContain("₹");
  });

  it("opens the bag, updates quantities, and removes products", async () => {
    await act(async () => productControl(container, "Earbuds One", ".add-button").click());
    await act(async () => container.querySelector(".bag-button").click());

    expect(container.querySelector('[role="dialog"]')).not.toBeNull();
    expect(container.textContent).toContain("Earbuds One");
    await act(async () => container.querySelector('[aria-label="Increase Earbuds One quantity"]').click());
    expect(container.querySelector(".bag-button").getAttribute("aria-label")).toBe("Shopping bag, 2 items");

    await act(async () => container.querySelector('[aria-label="Remove Earbuds One"]').click());
    expect(container.textContent).toContain("Your bag is taking a breather.");
  });

  it("places an order through the API and confirms it in the bag", async () => {
    fetch.mockImplementation(async (url, options) => {
      if (url.endsWith("/api/orders")) return jsonResponse({ id: 42 });
      return jsonResponse(products);
    });
    await act(async () => productControl(container, "Earbuds One", ".add-button").click());
    await act(async () => container.querySelector(".bag-button").click());
    await act(async () => {
      container.querySelector(".checkout-button").click();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(container.textContent).toContain("Order #42 placed");
    const request = fetch.mock.calls.find(([url]) => url.endsWith("/api/orders"));
    expect(JSON.parse(request[1].body)).toEqual({ customerId: 1, items: [{ productId: 1, quantity: 1 }] });
    expect(container.textContent).toContain("Your bag is taking a breather.");
  });

  it("keeps the bag intact and shows an error when checkout fails", async () => {
    fetch.mockImplementation(async (url) => url.endsWith("/api/orders")
      ? jsonResponse({ detail: "Only 0 unit(s) are in stock" }, 409)
      : jsonResponse(products));
    await act(async () => productControl(container, "Earbuds One", ".add-button").click());
    await act(async () => container.querySelector(".bag-button").click());
    await act(async () => {
      container.querySelector(".checkout-button").click();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(container.querySelector('[role="alert"]').textContent).toContain("Only 0 unit(s) are in stock");
    expect(container.textContent).toContain("Earbuds One");
  });

  it("filters saved products and sorts the catalog", async () => {
    await act(async () => productControl(container, "Earbuds One", ".favorite-button").click());
    await act(async () => container.querySelector(".wishlist-tab").click());
    expect(container.querySelectorAll(".product-card")).toHaveLength(1);
    expect(container.querySelector(".product-card h3").textContent).toBe("Earbuds One");

    await act(async () => container.querySelector(".wishlist-tab").click());
    await act(async () => {
      const sort = container.querySelector('[aria-label="Sort products"]');
      sort.value = "price-low";
      sort.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(container.querySelector(".product-card h3").textContent).toBe("Earbuds One");
  });
});
