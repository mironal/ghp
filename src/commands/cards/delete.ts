import { flags } from "@oclif/command"
import AuthCommand from "../../base"
import { reporterFlag, format } from "../../github/reporter"

export default class CardsDelete extends AuthCommand {
  public static description = "Delete a project card."

  public static flags = {
    help: flags.help({ char: "h" }),
    card: flags.string({
      char: "c",
      description: "A card ID that you want to delete",
      required: true,
    }),
    ...reporterFlag,
  }

  public async run() {
    const {
      flags: { card, reporter },
    } = this.parse(CardsDelete)

    const resp = await this.client.projects
      .deleteProjectCard({
        id: card,
        card_id: card,
      })
      .catch(e => this.error(e.message))

    this.log(format(resp.data, reporter!, "Deleted"))
  }
}
