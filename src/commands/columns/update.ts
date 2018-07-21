import { flags } from "@oclif/command"
import AuthCommand from "../../base"
import { reporterFlag, format, formatSingleColumn } from "../../github/reporter"

export default class ColumnsUpdate extends AuthCommand {
  public static description = "Update project column."

  public static flags = {
    help: flags.help({ char: "h" }),
    column: flags.string({
      char: "c",
      description: "A column ID that you want to update.",
      required: true,
    }),
    name: flags.string({
      char: "n",
      description: "The name of column.",
      required: true,
    }),
    ...reporterFlag,
  }

  public async run() {
    const {
      flags: { column, name, reporter },
    } = this.parse(ColumnsUpdate)

    const resp = await this.client.projects
      .updateProjectColumn({
        id: column,
        column_id: column,
        name,
      })
      .catch(e => this.error(e.message))

    this.log(format(resp.data, reporter!, formatSingleColumn))
  }
}
