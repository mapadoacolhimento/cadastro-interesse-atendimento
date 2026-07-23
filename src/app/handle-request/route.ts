
import * as Yup from "yup";
import {
	CONFIRM_REGISTRATION_EMAIL_ID,
	createContact,
	logger,
	sendEmail,
	upsertSupportInterestData,
} from "@/lib";
import { getErrorMessage } from "@/utils";

export const maxDuration = 30;

const payloadSchema = Yup.object({
	email: Yup.string().email().required(),
	confirmEmail: Yup.string().email().required(),
	firstName: Yup.string().required(),
	state: Yup.string().length(2).required(),
	supportType: Yup.string().oneOf(["psychological", "legal", "legal_and_psychological"]).required(),
}).required();

export async function POST(request: Request) {
	try {
		const payload = await request.json();

		await payloadSchema.validate(payload);

		let response = {};

		//salva no mongodb
		response = await upsertSupportInterestData(payload);
		//salva contato no loops como UserGroup= interesse-atrndimento tag=suppotType
		await createContact( payload.email, payload.firstName); 
		//envia
		await sendEmail(payload.email, CONFIRM_REGISTRATION_EMAIL_ID, {firsTName: payload.firstName})

		return Response.json(response);
	} catch (e) {
		const error = e as Record<string, unknown>;
		if (error["name"] === "ValidationError") {
			const errorMsg = `Validation error: ${getErrorMessage(error)}`;

			logger.error(`[handleRequest] - 400: ${errorMsg}`);
			return new Response(errorMsg, {
				status: 400,
			});
		}

		logger.error(`[handleRequest] - 500: ${getErrorMessage(error)}`);
		return new Response(getErrorMessage(error), {
			status: 500,
		});
	}
}
