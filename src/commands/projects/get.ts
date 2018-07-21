import { flags } from "@oclif/command"
import AuthCommand from "../../base"
import {
  format,
  reporterFlag,
  formatSingleProject,
} from "../../github/reporter"

export default class ProjectsGet extends AuthCommand {
  public static description = "Get a project."

  public static flags = {
    help: flags.help({ char: "h" }),
    project: flags.string({
      char: "p",
      description: "A project ID that you want to show.",
      required: true,
    }),
    ...reporterFlag,
  }

  public async run() {
    const {
      flags: { project, reporter },
    } = this.parse(ProjectsGet)

    const resp = await this.client.projects
      .getProject({
        id: project,
        project_id: project,
      })
      .catch(e => this.error(e.message))

    this.log(format(resp.data, reporter!, formatSingleProject))
  }
}
