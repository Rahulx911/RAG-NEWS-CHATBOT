import { GoogleAuth } from "google-auth-library";

const KEYFILEPATH = "/Users/rahuljain/voosh/project-root/gen-lang-client-0395493973-b7e43a433943.json";
export async function getAuthenticatedClient() {
  const auth = new GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: [
        "https://www.googleapis.com/auth/cloud-platform",
        "https://www.googleapis.com/auth/generative-language"
      ],
      
  });

  const client = await auth.getClient();
  return client;
}

export async function getAccessToken() {
  const client = await getAuthenticatedClient();
  const accessTokenResponse = await client.getAccessToken();
  return accessTokenResponse.token;
}
