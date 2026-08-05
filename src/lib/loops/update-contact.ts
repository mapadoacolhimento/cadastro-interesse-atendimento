import { getErrorMessage } from "@/utils";
import { LOOPS_API_KEY } from "../constants";

export default async function updateContact(
  email: string,
  firstName: string,
  state: string,
  supportType: string
): Promise<boolean> {
  try {
    const endpoint = "https://app.loops.so/api/v1/contacts/update";
    const apiKey = LOOPS_API_KEY;

    const response = await fetch(endpoint, {
      body: JSON.stringify({
        email: email,
        firstName: firstName,
        interesseEmAtendimento: supportType ,
        state: state
      }),
      method: "PUT",
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
      `[sendEmail] - Something went create contact to '${email}': ${getErrorMessage(
        e
      )}`
    );
    return false;
  }
}
