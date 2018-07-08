import { flags } from "@oclif/command"
import AuthCommand from "../../base"
import { format, reporterFlag } from "../../github/reporter"

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

    this.log(
      format<{ [key: string]: string }>(resp.data, flags.reporter!, data => {
        return Object.keys(data)
          .filter(key => !["creator"].includes(key))
          .map(key => `${key}: ${data[key]}`)
          .join("\n")
      }),
    )
  }
}
