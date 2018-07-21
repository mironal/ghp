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
      name: "repo",
      required: false,
      description: "Repository name in `owner/repo` format",
    },
    {
      name: "org",
      required: false,
      description: "The name of organization.",
    },
  ]

  private async exec(ownerRepo: string | undefined, org: string | undefined) {
    if (ownerRepo) {
      const [owner, repo] = ownerRepo.split("/")
      return this.client.projects.getRepoProjects({ owner, repo })
    } else if (org) {
      return this.client.projects.getOrgProjects({ org })
    }
    throw new Error(
      `${ProjectsList.args
        .map(a => a.name.toUpperCase())
        .join(" or ")} argument is required.`,
    )
  }

  public async run() {
    const {
      args,
      flags: { reporter },
    } = this.parse(ProjectsList)

    const { repo, org } = args

    const resp = await this.exec(repo, org).catch(e => this.error(e.message))
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
