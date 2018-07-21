import { flags } from "@oclif/command"
import { reporterFlag, format } from "../../github/reporter"
import AuthCommand from "../../base"

export default class ProjectsDelete extends AuthCommand {
  public static description = "Delete a project."

  public static flags = {
    help: flags.help({ char: "h" }),
    project: flags.string({
      char: "p",
      description: "A project ID that you want to delete.",
      required: true,
    }),
    ...reporterFlag,
  }

  public async run() {
    const {
      flags: { project, reporter },
    } = this.parse(ProjectsDelete)
    const resp = await this.client.projects
      .deleteProject({
        id: project,
        project_id: project,
      })
      .catch(e => this.error(e.message))
    this.log(format(resp.data, reporter!, () => "Deleted"))
  }
}
