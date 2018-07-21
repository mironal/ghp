import { flags } from "@oclif/command"
import AuthCommand from "../../base"
import { reporterFlag, format, formatSingleCard } from "../../github/reporter"

export default class CardsMove extends AuthCommand {
  public static description = "Move a project card."

  public static flags = {
    help: flags.help({ char: "h" }),
    card: flags.string({
      char: "c",
      description: "A card ID that you want to move",
      required: true,
    }),
    column: flags.integer({
      description: "A column ID of a culumn in the same project",
    }),
    position: flags.string({
      char: "p",
      description: "A position of card.",
      required: true,
      options: ["top", "bottom"], // TODO: after:<card_id>
    }),
    ...reporterFlag,
  }

  public async run() {
    const {
      flags: { card, column, position, reporter },
    } = this.parse(CardsMove)

    const resp = await this.client.projects
      .moveProjectCard({
        id: card,
        card_id: card,
        column_id: column,
        position,
      })
      .catch(e => this.error(e.message))

    this.log(format(resp.data, reporter!, formatSingleCard))
  }
}
