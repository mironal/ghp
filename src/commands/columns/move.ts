import { flags } from "@oclif/command"
import AuthCommand from "../../base"
import { reporterFlag, format, formatSingleColumn } from "../../github/reporter"

export default class ColumnsMove extends AuthCommand {
  public static description = "Move a project column"

  public static flags = {
    help: flags.help({ char: "h" }),
    column: flags.string({
      char: "c",
      description: "A column ID that you want to move.",
      required: true,
    }),
    position: flags.string({
      description: "A position of column",
      options: ["first", "last"], // TODO: after:<column_id>
      required: true,
    }),
    ...reporterFlag,
  }

  public async run() {
    const {
      flags: { column, position, reporter },
    } = this.parse(ColumnsMove)

    const resp = await this.client.projects
      .moveProjectColumn({
        id: column,
        column_id: column,
        position,
      })
      .catch(e => this.error(e.message))

    this.log(format(resp.data, reporter!, formatSingleColumn))
  }
}
