import { flags } from "@oclif/command"
import GitHub from "@octokit/rest"
import AuthCommand from "../base"
import cli from "cli-ux"
import { PerformanceObserver } from "perf_hooks"
import ColumnsCreate from "./columns/create"

interface PartialIssue {
  id: number
  number: number
  title: string
}

export default class Copy extends AuthCommand {
  public static description = "describe the command here"

  public static flags = {
    help: flags.help({ char: "h" }),
    src: flags.string({
      description: "The column ID of soruce column.",
      required: true,
    }),
    dest: flags.string({
      description: "The column ID of destination column.",
      required: true,
    }),
  }

  private async getSrcContents(
    // tslint:disable-next-line:variable-name
    column_id: string,
  ): Promise<{
    columnName: string
    issues: PartialIssue[]
  }> {
    const {
      data: { name: columnName },
    } = await this.client.projects.getProjectColumn({
      column_id,
      id: column_id,
    })

    const { data } = await this.client.projects.getProjectCards({
      column_id,
    })

    const contentURLs = data
      .filter((c: any) => typeof c.content_url === "string")
      .map((c: any) => c.content_url) as string[]

    const issues: PartialIssue[] = []
    for (const url of contentURLs) {
      const tokens = url.split("/")
      const num = tokens.pop()
      tokens.pop()
      const repo = tokens.pop()
      const owner = tokens.pop()

      if (num && owner && repo) {
        const {
          data: { title, id },
        } = await this.client.issues.get({
          owner,
          repo,
          number: parseInt(num, 10),
        })
        issues.push({ title, number: parseInt(num, 10), id: parseInt(id, 10) })
      }
    }
    return {
      columnName,
      issues,
    }
  }

  private async getDestColumn(
    // tslint:disable-next-line:variable-name
    column_id: string,
  ): Promise<{ columnName: string }> {
    const {
      data: { name: columnName },
    } = await this.client.projects.getProjectColumn({
      column_id,
      id: column_id,
    })

    return { columnName }
  }

  private async confirm(
    src: {
      columnName: string
      issues: PartialIssue[]
    },
    dest: {
      columnName: string
    },
  ) {
    const msg = `Are you sure you want to copy following cards from "${
      src.columnName
    }" to "${dest.columnName}"?

${src.issues.map(i => `  ${i.title} #${i.number}`).join("\n")}

[yN]`

    if (!(await cli.confirm(msg))) {
      this.error("Bye")
    }
  }

  public async run() {
    const {
      flags: { src, dest },
    } = this.parse(Copy)

    cli.action.start("fetching source cards")
    const srcContents = await this.getSrcContents(src)
    cli.action.stop()
    cli.action.start("fetching destination column")
    const destColumn = await this.getDestColumn(dest)
    cli.action.stop()

    await this.confirm(srcContents, destColumn)

    for (const i of srcContents.issues) {
      this.log(`copy card ${i.title} #${i.number}`)
      const cardResp = await this.client.projects
        .createProjectCard({
          column_id: dest,
          content_id: i.id,
          content_type: "Issue",
        })
        .catch(error => {
          let warn = `Cannot copy card for ${i.title} #${i.number}`
          if (typeof error.toJSON === "function") {
            JSON.parse(error.toJSON().message).errors.forEach(
              (e: any) =>
                (warn = `${warn}
  Reason: ${e.message}`),
            )
          }
          this.warn(warn)
        })
      if (cardResp) {
        this.log("copied!")
      }
    }
  }
}
