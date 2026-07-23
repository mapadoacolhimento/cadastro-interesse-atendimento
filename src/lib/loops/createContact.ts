import { getErrorMessage } from "@/utils";

export default async function createContact(
  email: string,
  firstName: string,
): Promise<boolean> {
  try {
    const endpoint = "https://app.loops.so/api/v1/contacts/create";
    const apiKey = process.env["LOOPS_API_KEY"];

    const response = await fetch(endpoint, {
      body: JSON.stringify({
        email: email,
        firstName: firstName,
        userGroup: "support-interest",
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
      `[sendEmail] - Something went create contact to '${email}': ${getErrorMessage(
        e
      )}`
    );
    return false;
  }
}
