import { describe, expect, it } from "vitest";
import { formatPrice } from "./format.js";

describe("formatPrice", () => {
  it("formats prices as Indian rupees", () => {
    expect(formatPrice(1299)).toContain("1,299");
    expect(formatPrice(1299)).toContain("₹");
  });
});
