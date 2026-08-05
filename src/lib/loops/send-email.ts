import { getErrorMessage } from "@/utils";
import { LOOPS_API_KEY } from "../constants";

export default async function sendEmail(
  email: string,
  id: string,
  firstName: string
): Promise<boolean> {
  try {
    const endpoint = "https://app.loops.so/api/v1/transactional";
    const apiKey = LOOPS_API_KEY;

    const response = await fetch(endpoint, {
      body: JSON.stringify({
        email,
        transactionalId: id,
        dataVariables: {
          first_name: firstName,
        },
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response.ok;
  } catch (e) {
    console.error(
      `[sendEmail] - Something went wrong when sending an email to this email '${email}', with this transactionalId: '${id}': ${getErrorMessage(
        e
      )}`
    );
    return false;
  }
}
