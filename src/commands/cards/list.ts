import { flags } from "@oclif/command"
import { reporterFlag, format } from "../../github/reporter"
import AuthCommand from "../../base"
import URL from "url"
interface ResolveableCard {
  id: number
  note?: string
  content_url?: string
  issue?: { number: number; title: string; assignees: { login: string }[] } // trick !
}

export default class CardsList extends AuthCommand {
  static description = "describe the command here"

  static flags = {
    help: flags.help({ char: "h" }),
    column: flags.string({
      char: "c",
      required: true,
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

  async run() {
    const { flags } = this.parse(CardsList)

    const { column, reporter, resolve, exclude } = flags

    const resp = await this.client.projects
      .getProjectCards({
        column_id: column,
      })
      .catch(this.error)

    let data = resp.data as Array<ResolveableCard>

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
            const [__, repos, owner, repo, issues, number] = URL.parse(
              c.content_url,
            ).pathname!.split("/")
            const issue = await this.client.issues.get({
              owner,
              repo,
              number: parseInt(number, 10),
            })

            c.issue = issue.data
          }

          return c
        }),
      )
    }

    const pretty = (card: ResolveableCard): string => {
      if (card.note) {
        return `${card.id}: ${card.note}`
      } else if (card.content_url) {
        if (card.issue) {
          return `${card.id}: ${card.issue.title} #${
            card.issue.number
          } ${card.issue.assignees.map(a => `@${a.login}`).join(" ")}`
        }
        return `${card.id}: ${card.content_url}`
      }
      return `${card.id}: Invalid response`
    }

    this.log(
      format<Array<ResolveableCard>>(data, reporter!, data =>
        data.map(pretty).join("\n"),
      ),
    )
  }
}
