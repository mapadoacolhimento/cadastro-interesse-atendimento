import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("../constants", () => ({
	LOOPS_API_KEY: "test-loops-api-key",
}));

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

import updateContact from "../loops/update-contact";

const email = "joana@example.com";
const firstName = "Joana";
const state = "SP";
const supportType = 'legal'

describe("createContact", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("returns true when the fetch request succeeds", async () => {
		mockFetch.mockResolvedValueOnce({ ok: true } as Response);

		const result = await updateContact(email, firstName, state, supportType);

		expect(result).toBe(true);
		expect(mockFetch).toHaveBeenCalledTimes(1);
		expect(mockFetch).toHaveBeenCalledWith(
			"https://app.loops.so/api/v1/contacts/update",
			expect.objectContaining({
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer test-loops-api-key",
				},
				body: JSON.stringify({
					email,
					firstName,
					interesseEmAtendimento: supportType,
        			state: state
				}),
			})
		);
	});

	it("returns false when the fetch response is not ok", async () => {
		mockFetch.mockResolvedValueOnce({ ok: false, statusText: "Bad Request" } as Response);

		const result = await updateContact(email, firstName, state, supportType);

		expect(result).toBe(false);
	});

	it("returns false when fetch throws an error", async () => {
		mockFetch.mockRejectedValueOnce(new Error("network failure"));

		const result = await updateContact(email, firstName, state, supportType);

		expect(result).toBe(false);
	});
});
