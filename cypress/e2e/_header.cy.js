describe("Header", () => {
  it("should display the header and site title on the home page", () => {
    cy.visit("/");
    cy.get("header").should("be.visible");
    cy.get("header h1 a").should("contain", "VibeReveal");
  });

  it("should show Register and Login links when not logged in", () => {
    cy.visit("/");
    cy.get("header .register a").should("have.attr", "href", "/auth/register");
    cy.get("header .login a").should("have.attr", "href", "/auth/login");
  });

  it("should show Add slideshow and Logout when logged in", () => {
    // Simule une session utilisateur en localStorage ou via cookie si ton app le permet
    cy.visit("/", {
      onBeforeLoad(win) {
        win.sessionStorage.setItem("user", JSON.stringify({ username: "bob" }));
      },
    });
    cy.reload();
    cy.get("header .nav-button a").contains("Add slideshow");
    cy.get("header .logout a").should("have.attr", "href", "/auth/logout");
  });
});
