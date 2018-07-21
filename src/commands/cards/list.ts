import { flags } from "@oclif/command"
import { reporterFlag, format, formatSingleCard } from "../../github/reporter"
import AuthCommand from "../../base"
import URL from "url"
import { ResolveableCard } from "../../type"

export default class CardsList extends AuthCommand {
  public static description = "List project cards"

  public static flags = {
    help: flags.help({ char: "h" }),
    column: flags.string({
      char: "c",
      required: true,
    }),
    archived_state: flags.string({
      description:
        "Filters the project cards that are returned by the card's state. ",
      options: ["all", "archived", "not_archived"],
      default: "not_archived",
    }),
    exclude: flags.string({
      char: "e",
      multiple: true,
      options: ["note", "issue", "pr"],
    }),
    resolve: flags.boolean({
      char: "r",
      description: "Resolve issue title if a card has content url",
    }),
    ...reporterFlag,
  }

  public async run() {
    const {
      flags: { column, archived_state, reporter, resolve, exclude },
    } = this.parse(CardsList)

    const resp = await this.client.projects
      .getProjectCards({
        column_id: column,
        archived_state,
      })
      .catch(e => this.error(e.message))

    let data = resp.data as ResolveableCard[]

    if (exclude && exclude.length > 0) {
      data = data.filter(c => {
        if (c.note && exclude.includes("note")) {
          return false
        } else if (c.content_url && exclude.includes("issue")) {
          return false
        }
        // TODO: PR
        return true
      })
    }

    if (resolve) {
      data = await Promise.all(
        data.map(async c => {
          if (c.content_url) {
            const [__, ___, owner, repo, ____, num] = URL.parse(
              c.content_url,
            ).pathname!.split("/")
            const issue = await this.client.issues.get({
              owner,
              repo,
              number: parseInt(num, 10),
            })

            c.issue = issue.data
          }

          return c
        }),
      )
    }

    this.log(
      format<ResolveableCard[]>(data, reporter!, d =>
        d.map(formatSingleCard).join("\n"),
      ),
    )
  }
}
