import { flags } from "@oclif/command"
import AuthCommand from "../../base"
import {
  format,
  reporterFlag,
  formatSingleProject,
} from "../../github/reporter"

export default class ProjectsCreate extends AuthCommand {
  static description = "describe the command here"

  static flags = {
    help: flags.help({ char: "h" }),
    repo: flags.string({ char: "r", description: "name to print" }),
    org: flags.string({ char: "o", description: "name to print" }),
    name: flags.string({
      char: "n",
      description: "name to print",
      required: true,
    }),
    body: flags.string({
      char: "b",
      description: "name to print",
    }),
    ...reporterFlag,
  }

  exec = async (
    ownerRepo: string | undefined,
    org: string | undefined,
    rest: any,
  ) => {
    if (ownerRepo) {
      const [owner, repo] = ownerRepo.split("/")
      return this.client.projects.createRepoProject({
        owner,
        repo,
        ...rest,
      })
    } else if (org) {
      return this.client.projects.createOrgProject({ org, ...rest })
    }
    throw new Error("aaa")
  }

  async run() {
    const { flags } = this.parse(ProjectsCreate)

    const { repo, org, ...rest } = flags

    const resp = await this.exec(repo, org, rest).catch(this.error)
    this.log(format(resp.data, flags.reporter!, formatSingleProject))
  }
}
