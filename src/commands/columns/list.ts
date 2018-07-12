import { flags } from "@oclif/command"
import { reporterFlag, format } from "../../github/reporter"
import AuthCommand from "../../base"

export default class ColumnsList extends AuthCommand {
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
    const { flags } = this.parse(ColumnsList)
    const { project } = flags

    const resp = await this.client.projects
      .getProjectColumns({
        id: project,
        project_id: project,
      })
      .catch(this.error)

    this.log(
      format<Array<{ id: string; name: number }>>(
        resp.data,
        flags.reporter!,
        data => data.map(c => `${c.id}: ${c.name}`).join("\n"),
      ),
    )
  }
}
