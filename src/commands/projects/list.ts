import { Command, flags } from "@oclif/command"

export default class ProjectsList extends Command {
  static description = "describe the command here"

  static flags = {
    help: flags.help({ char: "h" }),
    repo: flags.string({
      char: "r",
      description: "a repo name. <owner/repo>",
    }),
    org: flags.string({
      char: "o",
      description: "a organization name",
    }),
  }

  static args = []

  async run() {
    const { flags } = this.parse(ProjectsList)

    if (flags.repo) {
      console.log("get list of projects for repo", flags.repo)
    } else if (flags.org) {
      console.log("get list of projects for org", flags.org)
    }
  }
}
