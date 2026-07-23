import { expect } from "vitest";
import formatRegisterFormValues from "@/utils/formatRegisterFormValues";
import { Values } from "@/types";

describe("formatRegisterFormValues", () => {
	it("should format register form values correctly", () => {
		const values = {
			email: "JohnDoe@example.com",
			firstName: "john",

		} as Values;

		const expected = {
			email: "johndoe@example.com",
			firstName: "John",

		};

		const result = formatRegisterFormValues(values);

		expect(JSON.parse(result)).toStrictEqual(expected);
	});
});
