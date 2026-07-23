type ErrorWithMessage = {
	message: string;
};

type PrismaLikeError = {
	code: string;
	meta?: { target?: string[] };
	message: string;
	clientVersion: string;
};

function isPrismaKnownRequestError(error: unknown): error is PrismaLikeError {
	return (
		typeof error === "object" &&
		error !== null &&
		"code" in error &&
		"clientVersion" in error &&
		typeof (error as Record<string, unknown>)["code"] === "string" &&
		typeof (error as Record<string, unknown>)["clientVersion"] === "string"
	);
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
	return (
		typeof error === "object" &&
		error !== null &&
		"message" in error &&
		typeof (error as Record<string, unknown>)["message"] === "string"
	);
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
	try {
		if (isPrismaKnownRequestError(maybeError)) {
			const target = maybeError.meta?.target ?? [];
			return new Error(
				`Prisma returned an error code (${
					maybeError.code
				}) on these fields, '${target.join(",")}', with this message: ${
					maybeError.message
				}`
			);
		}

		if (isErrorWithMessage(maybeError)) return maybeError;
		return new Error(JSON.stringify(maybeError, null, 2));
	} catch {
		return new Error(String(maybeError));
	}
}

export default function getErrorMessage(error: unknown) {
	return toErrorWithMessage(error).message;
}
