
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
    
describe("Registration Form (/cadastro)", () => {
	beforeEach(() => {
		cy.visit("/cadastro");
	});

	it("should display validation messages when submitting an empty form", () => {
		cy.findByRole("button", { name: /enviar/i }).click();

		cy.contains("Insira seu primeiro nome.").should("be.visible");
		cy.contains("Insira seu e-mail.").should("be.visible");
		cy.contains("Esse campo é obrigatório.").should("be.visible");
	});

	it("should show an error when emails do not match", () => {
		cy.findByLabelText(/primeiro nome/i).type("Maria");
		cy.findByLabelText(/^e-mail/i).type("maria@exemplo.com");
		cy.findByLabelText(/confirme seu e-mail/i).type("outro@exemplo.com");

		cy.findByRole("button", { name: /enviar/i }).click();

		cy.contains("Os e-mails precisam ser iguais.").should("be.visible");
	});

	it("should submit the form successfully and redirect to /cadastro-finalizado", () => {
		cy.intercept("POST", "/handle-request", {
			statusCode: 200,
			body: { success: true },
		}).as("submitInterest");

		cy.findByLabelText(/primeiro nome/i).type("Maria");
		cy.findByLabelText(/^e-mail/i).type("maria@exemplo.com");
		cy.findByLabelText(/confirme seu e-mail/i).type("maria@exemplo.com");
		cy.findByLabelText(/estado/i).type("Rio de Janeiro{enter}", { force: true });
		cy.findByLabelText(/tipo de atendimento desejado/i).type("Acolhimento psicológico{enter}", { force: true });; // ou "psychological"

		cy.findByRole("button", { name: /enviar/i }).click({ force: true });

		// valida o envio correto do payload
		cy.wait("@submitInterest").then((interception) => {
			expect(interception.request.body).to.deep.include({
				firstName: "Maria",
				email: "maria@exemplo.com",
				confirmEmail: "maria@exemplo.com",
				state: "RJ",
				supportType: "psychological",
			});
		});

		cy.url().should("include", "/cadastro-finalizado");
		cy.contains("Recebemos seu registro de interesse.").should("be.visible");
	});

	it("should not redirect when API returns 500 error status", () => {
		cy.intercept("POST", "/handle-request", {
			statusCode: 500,
			body: "Internal Server Error",
		}).as("submitInterestError");

		cy.findByLabelText(/primeiro nome/i).type("Maria");
		cy.findByLabelText(/^e-mail/i).type("maria@exemplo.com");
		cy.findByLabelText(/confirme seu e-mail/i).type("maria@exemplo.com");
		cy.findByLabelText(/estado/i).type("Rio de Janeiro{enter}", { force: true });
		cy.findByLabelText(/tipo de atendimento desejado/i).type("Acolhimento psicológico{enter}", { force: true });

		cy.findByRole("button", { name: /enviar/i }).click({ force: true });

		cy.wait("@submitInterestError");
		cy.url().should("not.include", "/cadastro-finalizado");
	});
});