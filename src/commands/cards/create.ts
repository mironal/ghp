import { flags } from "@oclif/command"
import { reporterFlag, formatSingleCard, format } from "../../github/reporter"
import AuthCommand from "../../base"

export default class CardsCreate extends AuthCommand {
  public static description = "Create a project card."

  public static examples = [
    "ghp cards:create --column=<column id> --note=hogehoge",
    "ghp cards:create --column=<column id> --content_id=<issue or pr number> --content_type=<Issue or PullRequest>",
  ]

  public static flags = {
    help: flags.help({ char: "h" }),
    column: flags.string({
      char: "c",
      description: "A column ID that you want to create card.",
      required: true,
    }),
    note: flags.string({
      char: "n",
      description: "The card's note content.",
    }),
    content_id: flags.integer({
      description:
        "The issue or pull request id you want to associate with this card.",
      dependsOn: ["content_type"],
    }),
    content_type: flags.string({
      description: "The type of content you want to associate with this card.",
      dependsOn: ["content_id"],
      options: ["Issue", "PullRequest"],
    }),
    ...reporterFlag,
  }

  public async run() {
    const {
      flags: { column, note, content_id, content_type, reporter },
    } = this.parse(CardsCreate)

    if (note && content_id) {
      this.error(
        "Invalid argument. You can pass either note or content_id arguments.",
      )
    }
    if (!note || !content_id) {
      this.error(
        "Invalid argument. You should pass note or content_id arguments.",
      )
    }

    const resp = await this.client.projects
      .createProjectCard({
        column_id: column,
        note,
        content_id,
        content_type,
      })
      .catch(e => this.error(e.message))

    this.log(format(resp.data, reporter!, formatSingleCard))
  }
}
