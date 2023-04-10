describe('Add thesis on change', () => {
    it('should signin', () => {
      // Start from the index page
      cy.visit('http://localhost:3000/')
  
      // The new page should contain an h1 with "About page"
      cy.get('h1').contains('Thesis Abstract Management System for College of Engineering')
    })
  })

export {}