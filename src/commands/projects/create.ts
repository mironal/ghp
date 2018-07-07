import { Command, flags } from "@oclif/command"

export default class ProjectsCreate extends Command {
  static description = "describe the command here"

  static flags = {
    help: flags.help({ char: "h" }),
    repo: flags.string({ char: "r", description: "name to print" }),
    org: flags.string({ char: "o", description: "name to print" }),
    name: flags.string({
      char: "n",
      description: "name to print",
      required: true,
    }),
    body: flags.string({
      char: "b",
      description: "name to print",
    }),
  }

  static args = []

  async run() {
    const { flags } = this.parse(ProjectsCreate)

    const { repo, org, name } = flags

    if (repo) {
      this.log(`Create a project named ${name} to ${repo} repository.`)
    } else if (org) {
      this.log(`Create a project named ${name} to ${org} repository.`)
    }
  }
}
