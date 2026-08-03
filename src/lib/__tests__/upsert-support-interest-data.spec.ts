import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({
	prisma: {
		supportInterestData: {
			upsert: vi.fn(),
		},
	},
}));

vi.mock("@/lib", async () => {
	const actual = await vi.importActual<typeof import("@/lib")>("@/lib");
	return {
		...actual,
		logger: {
			error: vi.fn(),
		},
	};
});

import upsertSupportInterestData from "../upsert-support-interest-data";
import { prisma } from "@/lib/db";
import { logger } from "@/lib";

const payload = {
	email: "maria@example.com",
	confirmEmail: "maria@example.com",
	firstName: "Maria",
	state: "BA",
	supportType: "psychological",
};

describe("upsertSupportInterestData", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("returns JSON response with id when upsert succeeds", async () => {
		vi.mocked(prisma.supportInterestData.upsert).mockResolvedValueOnce({
			id: "abc123",
		});

		const response = await upsertSupportInterestData(payload);

		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ id: "abc123" });
		expect(prisma.supportInterestData.upsert).toHaveBeenCalledWith({
			where: { email: payload.email },
			update: {
				...payload,
				updatedAt: expect.any(String),
			},
			create: {
				...payload,
			},
		});
	});

	it("returns 400 when Prisma throws a validation error", async () => {
		const validationError = new Error("invalid payload");
		(validationError as Record<string, unknown>).name = "ValidationError";
		vi.mocked(prisma.supportInterestData.upsert).mockRejectedValueOnce(validationError);

		const response = await upsertSupportInterestData(payload);

		expect(response.status).toBe(400);
		expect(await response.text()).toContain("Validation error: invalid payload");
		expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("[upsertsupportInterestData] - 400"));
	});

	it("returns 500 when Prisma throws a generic error", async () => {
		const genericError = new Error("database failure");
		vi.mocked(prisma.supportInterestData.upsert).mockRejectedValueOnce(genericError);

		const response = await upsertSupportInterestData(payload);

		expect(response.status).toBe(500);
		expect(await response.text()).toBe("database failure");
		expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("[upsertsupportInterestData] - 500"));
	});
});
