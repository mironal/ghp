import { flags } from "@oclif/command"
import AuthCommand from "../../base"
import { format, reporterFlag } from "../../github/reporter"

export default class ProjectsList extends AuthCommand {
  public static description = "List projects"

  public static flags = {
    help: flags.help({ char: "h" }),
    ...reporterFlag,
  }

  public static args = [
    {
      name: "target",
      required: true,
      description:
        "Repository name in `owner/repo` format or the name of organization.",
    },
  ]

  private async exec(target: string) {
    if (target.includes("/")) {
      const [owner, repo] = target.split("/")
      return this.client.projects.getRepoProjects({ owner, repo })
    }
    return this.client.projects.getOrgProjects({ org: target })
  }

  public async run() {
    const {
      args,
      flags: { reporter },
    } = this.parse(ProjectsList)

    const { target } = args

    const resp = await this.exec(target).catch(e => this.error(e.message))
    this.log(
      format<Array<{ name: string; id: number }>>(
        resp.data,
        reporter!,
        data => {
          return data.map(p => `${p.id}: ${p.name}`).join("\n")
        },
      ),
    )
  }
}
