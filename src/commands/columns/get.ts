import { flags } from "@oclif/command"
import AuthCommand from "../../base"
import { reporterFlag, format, formatSingleColumn } from "../../github/reporter"

export default class ColumnsGet extends AuthCommand {
  public static description = "Get a column."

  public static flags = {
    help: flags.help({ char: "h" }),
    column: flags.string({
      char: "c",
      description: "A column ID that you want to show.",
      required: true,
    }),
    ...reporterFlag,
  }

  public async run() {
    const {
      flags: { column, reporter },
    } = this.parse(ColumnsGet)

    const resp = await this.client.projects
      .getProjectColumn({
        column_id: column,
        id: column,
      })
      .catch(e => this.error(e.message))

    this.log(format(resp.data, reporter!, formatSingleColumn))
  }
}
