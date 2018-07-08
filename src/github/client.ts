import Github from "@octokit/rest"
import { readAuthTokenSync } from "./auth"

export const createRestClient = () => {
  const client = new Github()

  const token = readAuthTokenSync()
  if (token) {
    client.authenticate({
      type: "token",
      token,
    })
  }
  return { client, authed: !!token }
}
