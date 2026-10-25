import { render, screen, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { afterEach, describe, expect, test } from "vitest";
import App from "../src/App";

function mountAt(pathname: string) {
  window.history.pushState({}, "", pathname);
  return render(
    <HelmetProvider>
      <App />
    </HelmetProvider>,
  );
}

afterEach(() => {
  window.history.pushState({}, "", "/");
});

describe("App shell", () => {
  test("mounts the marketing shell without throwing", () => {
    const { container } = mountAt("/");
    expect(container.firstChild).not.toBeNull();
    expect(container.textContent).toContain("JW AI Consulting");
  });

  test("renders the hero headline on the homepage", () => {
    mountAt("/");
    expect(screen.getByText(/Architecting the Intelligence Layer/i)).toBeTruthy();
    expect(screen.getByText(/Enterprise\./)).toBeTruthy();
  });

  test("renders the primary navigation", () => {
    const { container } = mountAt("/");
    for (const label of ["Services", "Portfolio", "Austin AI Events", "Book a Call"]) {
      expect(container.textContent, `nav is missing "${label}"`).toContain(label);
    }
  });

  test("renders the footer", () => {
    const { container } = mountAt("/");
    expect(container.textContent).toContain("JW AI Consulting. All rights reserved.");
  });
});

describe("routing", () => {
  test("serves the just-start offer page on its own route", async () => {
    mountAt("/just-start");
    await waitFor(() => {
      expect(screen.getByText(/Start with the call\./i)).toBeTruthy();
    });
  });

  test("an unknown path still renders the shell rather than a blank page", () => {
    const { container } = mountAt("/this-route-does-not-exist");
    expect(container.textContent).toContain("JW AI Consulting");
  });
});
