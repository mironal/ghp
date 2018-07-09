import { flags } from "@oclif/command"
import AuthCommand from "../../base"
import {
  format,
  reporterFlag,
  formatSingleProject,
} from "../../github/reporter"

export default class ProjectsGet extends AuthCommand {
  static description = "describe the command here"

  static flags = {
    help: flags.help({ char: "h" }),
    project: flags.string({
      char: "p",
      required: true,
    }),
    ...reporterFlag,
  }

  static args = []

  async run() {
    const { flags } = this.parse(ProjectsGet)
    const { project } = flags

    const resp = await this.client.projects
      .getProject({
        id: project,
        project_id: project,
      })
      .catch(this.error)

    this.log(format(resp.data, flags.reporter!, formatSingleProject))
  }
}
