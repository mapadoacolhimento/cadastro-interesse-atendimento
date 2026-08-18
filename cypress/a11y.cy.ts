function terminalLog(violations: Array<Record<string, unknown>>) {
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