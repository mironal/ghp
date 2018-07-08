import Command from "@oclif/command"
import Config from "@oclif/config"
import { createRestClient } from "./github/client"
import Github from "@octokit/rest"

export default class AuthCommand extends Command {
  run(): Promise<any> {
    throw new Error("Method not implemented.")
  }
  constructor(argv: string[], config: Config.IConfig) {
    super(argv, config)
    const { authed, client } = createRestClient()
    if (!authed)
      this.error(
        "Authentication is required to execute this command. Please run `ghp auth`",
      )
    this.client = client
  }
  client: Github
}
