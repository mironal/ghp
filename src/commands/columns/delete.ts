import { flags } from "@oclif/command"
import { reporterFlag, format } from "../../github/reporter"
import AuthCommand from "../../base"

export default class ColumnsDelete extends AuthCommand {
  public static description = "Delet project column"

  public static flags = {
    help: flags.help({ char: "h" }),
    column: flags.string({
      char: "c",
      description: "A column ID that you want to delete.",
      required: true,
    }),
    ...reporterFlag,
  }

  public async run() {
    const {
      flags: { column, reporter },
    } = this.parse(ColumnsDelete)

    const resp = await this.client.projects
      .deleteProjectColumn({
        id: column,
        column_id: column,
      })
      .catch(e => this.error(e.message))

    this.log(format(resp.data, reporter!, () => "Deleted"))
  }
}
