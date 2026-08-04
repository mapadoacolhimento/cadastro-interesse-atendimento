import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("../constants", () => ({
	LOOPS_API_KEY: "test-loops-api-key",
}));

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

import sendEmail from "../loops/send-email";

const email = "maria@example.com";
const transactionalId = "confirm-registration-email-id";
const firsTName = "Maria";

describe("sendEmail", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("returns true when the fetch request succeeds", async () => {
		mockFetch.mockResolvedValueOnce({ ok: true } as Response);

		const result = await sendEmail(email, transactionalId, firsTName);

		expect(result).toBe(true);
		expect(mockFetch).toHaveBeenCalledTimes(1);
		expect(mockFetch).toHaveBeenCalledWith(
			"https://app.loops.so/api/v1/transactional",
			expect.objectContaining({
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer test-loops-api-key",
				},
				body: JSON.stringify({
					email,
					transactionalId,
					dataVariables: {
						first_name: firsTName,
					},
				}),
			})
		);
	});

	it("returns false when the fetch response is not ok", async () => {
		mockFetch.mockResolvedValueOnce({ ok: false, statusText: "Bad Request" } as Response);

		const result = await sendEmail(email, transactionalId, firsTName);

		expect(result).toBe(false);
	});

	it("returns false when fetch throws an error", async () => {
		mockFetch.mockRejectedValueOnce(new Error("network failure"));

		const result = await sendEmail(email, transactionalId, firsTName);

		expect(result).toBe(false);
	});
});
