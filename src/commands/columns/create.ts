import { flags } from "@oclif/command"
import { reporterFlag, format, formatSingleColumn } from "../../github/reporter"
import AuthCommand from "../../base"

export default class ColumnsCreate extends AuthCommand {
  public static description = "Create a project column."

  public static flags = {
    help: flags.help({ char: "h" }),
    project: flags.string({
      char: "p",
      description: "A project ID that you want to create column.",
      required: true,
    }),
    name: flags.string({
      char: "n",
      description: "A name of column.",
      required: true,
    }),
    ...reporterFlag,
  }

  public async run() {
    const {
      flags: { project, name, reporter },
    } = this.parse(ColumnsCreate)

    const resp = await this.client.projects
      .createProjectColumn({
        project_id: project,
        id: project,
        name,
      })
      .catch(e => this.error(e.message))

    this.log(format(resp.data, reporter!, formatSingleColumn))
  }
}
