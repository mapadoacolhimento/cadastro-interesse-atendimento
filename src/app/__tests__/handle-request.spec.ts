import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib", () => ({
	CONFIRM_REGISTRATION_EMAIL_ID: "confirm-registration-email-id",
	updateContact: vi.fn(),
	sendEmail: vi.fn(),
	upsertSupportInterestData: vi.fn(),
	logger: {
		error: vi.fn(),
	},
}));

import { POST } from "../handle-request/route";
import { updateContact, sendEmail, upsertSupportInterestData, logger } from "@/lib";

const validPayload = {
	email: "joana@example.com",
	confirmEmail: "joana@example.com",
	firstName: "Joana",
	state: "SP",
	supportType: "psychological",
};

const buildRequest = (body: unknown) =>
	new Request("http://localhost/handle-request", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});

describe("handle-request route", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("should return 200 and JSON response when payload is valid", async () => {
		const expectedResponse = { id: "123" };
		vi.mocked(upsertSupportInterestData).mockResolvedValueOnce(expectedResponse);

		const response = await POST(buildRequest(validPayload));

		expect(response.status).toBe(200);
		expect(await response.json()).toEqual(expectedResponse);
		expect(upsertSupportInterestData).toHaveBeenCalledWith(validPayload);
		expect(updateContact).toHaveBeenCalledWith(validPayload.email, validPayload.firstName, validPayload.state);
		expect(sendEmail).toHaveBeenCalledWith(validPayload.email, "confirm-registration-email-id", validPayload.firstName);
	});

	it("should return 400 when payload is invalid", async () => {
		const invalidPayload = { ...validPayload, state: "S" };

		const response = await POST(buildRequest(invalidPayload));

		expect(response.status).toBe(400);
		expect(await response.text()).toContain("Validation error");
		expect(upsertSupportInterestData).not.toHaveBeenCalled();
		expect(updateContact).not.toHaveBeenCalled();
		expect(sendEmail).not.toHaveBeenCalled();
	});

	it("should return 500 when upsertSupportInterestData throws", async () => {
		const error = new Error("database failure");
		vi.mocked(upsertSupportInterestData).mockRejectedValueOnce(error);

		const response = await POST(buildRequest(validPayload));

		expect(response.status).toBe(500);
		expect(await response.text()).toBe(error.message);
		expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("[handleRequest] - 500"));
	});
});
