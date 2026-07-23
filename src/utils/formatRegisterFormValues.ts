import { Values } from "@/types";
import getFirstName from "./getFirstName";


const yesNoToBoolean = (value?: string | null): boolean | null =>
	value == null || value === "" ? null : value === "yes";

export default function formatRegisterFormValues(values: Values) {
	const parseValues = {
		...values,
		email: values.email.toLowerCase(),
		firstName: getFirstName(values.firstName),
	};

	return JSON.stringify(parseValues);
}
