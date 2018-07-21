import { flags } from "@oclif/command"
import AuthCommand from "../../base"
import { reporterFlag, formatSingleCard, format } from "../../github/reporter"

export default class CardsUpdate extends AuthCommand {
  public static description = "Update a project card."

  public static flags = {
    help: flags.help({ char: "h" }),
    card: flags.string({
      char: "c",
      description: "A card ID that you want to update",
      required: true,
    }),
    note: flags.string({
      char: "n",
      description:
        "The card's note content. This cannot be specified if the card already has a `content_id` and `content_type`.",
    }),
    archived: flags.boolean({
      char: "a",
      description: "To archive a project card.",
      exclusive: ["unarchived"],
    }),
    unarchived: flags.boolean({
      char: "u",
      description: "To unarchive a project card.",
      exclusive: ["archived"],
    }),
    ...reporterFlag,
  }

  public async run() {
    const {
      flags: { card, note, archived, unarchived, reporter },
    } = this.parse(CardsUpdate)

    let archivedOption: boolean | undefined
    if (archived) {
      archivedOption = true
    } else if (unarchived) {
      archivedOption = false
    }

    const resp = await this.client.projects
      .updateProjectCard({
        id: card,
        card_id: card,
        note,
        archived: archivedOption,
      })
      .catch(e => this.error(e.message))

    this.log(format(resp.data, reporter!, formatSingleCard))
  }
}
