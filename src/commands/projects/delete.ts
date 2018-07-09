import { Command, flags } from "@oclif/command"
import {
  reporterFlag,
  format,
  formatSingleProject,
} from "../../github/reporter"
import AuthCommand from "../../base"

export default class ProjectsDelete extends AuthCommand {
  static description = "describe the command here"

  static flags = {
    help: flags.help({ char: "h" }),
    project: flags.string({
      char: "p",
      required: true,
    }),
    ...reporterFlag,
  }

  async run() {
    const { flags } = this.parse(ProjectsDelete)
    const { project } = flags
    const resp = await this.client.projects
      .deleteProject({
        id: project,
        project_id: project,
      })
      .catch(this.error)
    this.log(format(resp.data, flags.reporter!, () => "Deleted"))
  }
}
