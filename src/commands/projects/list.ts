import { Command, flags } from "@oclif/command"
import AuthCommand from "../../base"
import { format, reporterFlag } from "../../github/reporter"
import GitHub from "@octokit/rest"

export default class ProjectsList extends AuthCommand {
  static description = "describe the command here"

  static flags = {
    help: flags.help({ char: "h" }),
    repo: flags.string({
      char: "r",
      exclusive: ["org"],
      description: "a repo name. <owner/repo>",
    }),
    org: flags.string({
      char: "o",
      exclusive: ["repo"],
      description: "a organization name",
    }),
    ...reporterFlag,
  }

  async exec(ownerRepo: string | undefined, org: string | undefined) {
    if (ownerRepo) {
      const [owner, repo] = ownerRepo.split("/")
      return this.client.projects.getRepoProjects({ owner, repo })
    } else if (org) {
      return this.client.projects.getOrgProjects({ org: org })
    }
    throw new Error("Missing required flag: --repo or --org")
  }

  async run() {
    const { flags } = this.parse(ProjectsList)

    const resp = await this.exec(flags.repo, flags.org).catch(this.error)
    this.log(
      format<Array<{ name: string; id: number }>>(
        resp.data,
        flags.reporter!,
        data => {
          return data.map(p => `${p.id}: ${p.name}`).join("\n")
        },
      ),
    )
  }
}
