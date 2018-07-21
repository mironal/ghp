import { flags } from "@oclif/command"
import { reporterFlag, format, formatSingleColumn } from "../../github/reporter"
import AuthCommand from "../../base"

export default class ColumnsList extends AuthCommand {
  public static description = "List columns in a project."

  public static flags = {
    help: flags.help({ char: "h" }),
    project: flags.string({
      char: "p",
      description: "A project ID that you want to show list of columns.",
      required: true,
    }),
    ...reporterFlag,
  }

  public async run() {
    const {
      flags: { project, reporter },
    } = this.parse(ColumnsList)

    const resp = await this.client.projects
      .getProjectColumns({
        id: project,
        project_id: project,
      })
      .catch(e => this.error(e.message))

    this.log(
      format<Array<{ id: number; name: string }>>(resp.data, reporter!, data =>
        data.map(formatSingleColumn).join("\n"),
      ),
    )
  }
}
