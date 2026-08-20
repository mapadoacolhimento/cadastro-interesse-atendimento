

function terminalLog(violations) {
	cy.task(
		"log",
		`${violations.length} accessibility violation${
			violations.length === 1 ? "" : "s"
		} ${violations.length === 1 ? "was" : "were"} detected`
	);
	const violationData = violations.map(
		({ id, impact, description, nodes }) => ({
			id,
			impact,
			description,
			nodes: (nodes as Array<unknown>).length,
		})
	);

	cy.task("table", violationData);
}

describe("Accessibility", () => {
	const sizes = [
		{ name: "Desktop", viewportHeight: 1080, viewportWidth: 1920 },
		{ name: "Mobile", viewportHeight: 844, viewportWidth: 390 },
	];

	describe("Home Page", () => {
		sizes.forEach((size) => {
			describe(
				size.name,
				{
					viewportHeight: size.viewportHeight,
					viewportWidth: size.viewportWidth,
				},
				() => {
					it("should pass the accessibility test", () => {
						cy.visit("/");
						cy.contains("Cadastro temporariamente fechado").should("be.visible");
						cy.injectAxe();
						cy.checkA11y(null, null, terminalLog);
					});
				}
			);
		});
	});

	describe("Cadastro Page", () => {
		sizes.forEach((size) => {
			describe(
				size.name,
				{
					viewportHeight: size.viewportHeight,
					viewportWidth: size.viewportWidth,
				},
				() => {
					it("should pass the accessibility test", () => {
						cy.visit("/cadastro");
						cy.injectAxe();
						cy.checkA11y(null, null, terminalLog);
					});
				}
			);
		});
	});

	describe("Cadastro Finalizado Page", () => {
		sizes.forEach((size) => {
			describe(
				size.name,
				{
					viewportHeight: size.viewportHeight,
					viewportWidth: size.viewportWidth,
				},
				() => {
					it("should pass the accessibility test", () => {
						cy.visit("/cadastro-finalizado");
						cy.contains("Recebemos seu registro de interesse.").should("be.visible");
						cy.injectAxe();
						cy.checkA11y(null, null, terminalLog);
					});
				}
			);
		});
	});
});