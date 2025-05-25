describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:4000/')
  })
})

describe("Index page", () => {
  it("should display the header, footer, and login prompt when not logged in", () => {
    cy.visit("/");
    cy.get("header").should("be.visible");
    cy.get("footer").should("be.visible");
    cy.contains("Veuillez").should("be.visible");
    cy.get('a[href="/auth/login"]').should("exist");
    cy.contains("Public Presentations").should("be.visible");
  });

  it("should display 'Nothing' if there are no public presentations", () => {
    cy.visit("/");
    cy.contains("Nothing").should("be.visible");
  });

  // Pour tester l'affichage connecté, il faut simuler une session côté serveur.
  // Si tu as un endpoint de login, tu peux faire :
  // cy.request("POST", "/auth/login", { username: "bob", password: "motdepasse" })
  // puis cy.visit("/") et vérifier les sections "Your Presentations" et "Others' Public Presentations"
});