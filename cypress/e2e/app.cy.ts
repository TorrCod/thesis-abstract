describe('Navigation', () => {
    it('should visit to home page', () => {
      // Start from the index page
      cy.visit('http://localhost:3000/')
  
      // The new page should contain an h1 with "About page"
      cy.get('h1').contains('Thesis Abstract Management System for College of Engineering')
    }),
    it('should navigate to thesis page', () => {
        // Start from the index page
        cy.visit('http://localhost:3000/')
    
        // The new page should contain an h1 with "About page"
        cy.get('a[href*="/thesis"] > svg').click()

        // check if div has classname of thesis-items
        // cy.get("div").should("have.class","thesis-items")
      })

      it('reload thesis page', () => {
        // Start from the index page
        cy.visit('http://localhost:3000/thesis')
      })
  })
