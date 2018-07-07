import { Command, flags } from "@oclif/command"

export default class ProjectsGet extends Command {
  static description = "describe the command here"

  static flags = {
    help: flags.help({ char: "h" }),
    project: flags.string({ char: "p", description: "A project id." }),
  }

  static args = []

  async run() {
    const { flags } = this.parse(ProjectsGet)
    const { project } = flags

    this.log(`get a project ${project}`)
  }
}
