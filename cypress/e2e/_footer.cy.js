describe("Footer", () => {
  it("should display the footer on the home page", () => {
    cy.visit("/"); // adapte le chemin si besoin
    cy.get("footer").should("be.visible");
    cy.get("footer").contains("© 2025 VibeRevealMonolith");
  });
});
