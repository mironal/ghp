import { Command, flags } from "@oclif/command"
import cli from "cli-ux"

import { writeAuthToken, authTokenFilepath } from "../github/auth"
import { createRestClient } from "../github/client"

export default class Auth extends Command {
  public static description = "Auth ghp command."

  public static flags = {
    help: flags.help({ char: "h" }),
    debug: flags.boolean({ hidden: true }),
  }

  public async run() {
    const { client, authed } = createRestClient()
    if (authed) {
      const overrite = await cli.confirm(
        "You already have a GitHub token, will you overwrite it? [Y/n]",
      )
      if (!overrite) {
        this.exit()
      }
    }

    this.log("Generate GitHub's token.")
    const username = await cli.prompt("Please input your GitHub username")
    this.log("\nThanks", username, "😘\n")
    const password = await cli.prompt(
      "Please input your GitHub password.\nYour password will only be used to generate\nthe GitHub token and will not be saved",
      { type: "hide" },
    )

    client.authenticate({
      type: "basic",
      username,
      password,
    })

    client.authorization
      .create({
        note: "ghp",
        note_url: "https://github.com/mironal/ghp",
        scopes: ["repo"],
      })
      .then(resp => writeAuthToken(resp.data.token))
      .then(() => this.log("Your token write to", authTokenFilepath))
      .catch(error => this.error(error))
  }
}
