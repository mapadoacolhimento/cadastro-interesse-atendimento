
describe("Homepage Navigation", () => {
		it("should display the closed registration message and navigate to /cadastro", () => {
			cy.visit("/");

			cy.contains("Cadastro temporariamente fechado").should("be.visible");
			cy.contains("Ligue 180").should("be.visible");

			cy.findByRole("link", { name: /quero ser avisada/i }).click();
			cy.url().should("include", "/cadastro");
		});

		it("should open external public services link in a new tab", () => {
			cy.visit("/");

			cy.findByRole("link", { name: /busque o serviço público/i })
				.should("have.attr", "href", "https://www.mapadoacolhimento.org/servicos-publicos/")
				.should("have.attr", "target", "_blank");
		});
	});

	describe("Submit Interest Form", () => {
		it("should submit the interest form successfully and redirect to confirmation page", () => {
			cy.intercept("POST", "/handle-request", {
				statusCode: 200,
				body: { success: true },
			}).as("submitInterest");

			cy.visit("/cadastro");

			// NOTA: Ajuste os seletores abaixo se os labels/placeholders do FormSupportInterest forem diferentes
			cy.findByLabelText(/nome/i).type("Maria");
			cy.findByLabelText(/e-mail/i).first().type("maria@exemplo.com");
			cy.findByLabelText(/confirme seu e-mail/i).type("maria@exemplo.com");
			cy.findByLabelText(/estado/i).select("RJ");
			cy.findByLabelText(/tipo de acolhimento/i).select("psychological");

			cy.findByRole("button", { name: /enviar/i }).click();

			cy.wait("@submitInterest").its("request.body").should("deep.equal", {
				firstName: "Maria",
				email: "maria@exemplo.com",
				confirmEmail: "maria@exemplo.com",
				state: "RJ",
				supportType: "psychological",
			});

			cy.url().should("include", "/cadastro-finalizado");
			cy.contains("Recebemos seu registro de interesse.").should("be.visible");
		});

		it("should display validation error when API returns status 400", () => {
			cy.intercept("POST", "/handle-request", {
				statusCode: 400,
				body: "Validation error: email is a required field",
			}).as("submitInterestError");

			cy.visit("/cadastro");

			cy.findByRole("button", { name: /enviar/i }).click();

			cy.wait("@submitInterestError");
			cy.contains(/error/i).should("be.visible");
		});
	});