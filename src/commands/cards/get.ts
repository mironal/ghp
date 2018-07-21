import { flags } from "@oclif/command"
import AuthCommand from "../../base"
import { format, reporterFlag, formatSingleCard } from "../../github/reporter"

export default class CardsGet extends AuthCommand {
  public static description = "Get a project card"

  public static flags = {
    help: flags.help({ char: "h" }),
    card: flags.string({
      char: "c",
      description: "A card ID that you want to show",
      required: true,
    }),
    ...reporterFlag,
  }

  public async run() {
    const {
      flags: { card, reporter },
    } = this.parse(CardsGet)

    const resp = await this.client.projects
      .getProjectCard({
        id: card,
        card_id: card,
      })
      .catch(e => this.error(e.message))

    this.log(format(resp.data, reporter!, formatSingleCard))
  }
}
