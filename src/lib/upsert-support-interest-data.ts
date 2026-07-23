"use server";

import { getErrorMessage } from "@/utils";
import { logger } from "@/lib";
import { Values } from "@/types";
import { prisma } from "@/lib/db";

async function upsertSupportInterestData(values: Values) {
	try {

		const supportInterestData = await prisma.supportInterestData.upsert({
			where: {
				email: values.email,
			},
			update: {
				...values,
				updatedAt: new Date().toISOString(),
			},
			create: {
				...values,
			},
		});

		return Response.json({ id: supportInterestData.id });
	} catch (e) {
		const error = e as Record<string, unknown>;
		if (error["name"] === "ValidationError") {
			const errorMsg = `Validation error: ${getErrorMessage(error)}`;
			logger.error(`[upsertsupportInterestData] - 400: ${errorMsg}`);
			return new Response(errorMsg, {
				status: 400,
			});
		}

		logger.error(`[upsertsupportInterestData] - 500: ${getErrorMessage(error)}`);
		return new Response(getErrorMessage(error), {
			status: 500,
		});
	}
}

export default upsertSupportInterestData;