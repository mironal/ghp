import { flags } from "@oclif/command"
import AuthCommand from "../../base"
import {
  format,
  reporterFlag,
  formatSingleProject,
} from "../../github/reporter"

export default class ProjectsCreate extends AuthCommand {
  public static description =
    "Create the project in your repository or organization."

  public static flags = {
    help: flags.help({ char: "h" }),
    name: flags.string({
      char: "n",
      description: "The name of project.",
      required: true,
    }),
    body: flags.string({
      char: "b",
      description: "The body of the project.",
    }),
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

  private exec = async (
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
    throw new Error(
      `${ProjectsCreate.args
        .map(a => a.name.toUpperCase())
        .join(" or ")} argument is required.`,
    )
  }

  public async run() {
    const {
      args,
      flags: { reporter, ...rest },
    } = this.parse(ProjectsCreate)

    const { repo, org } = args

    const resp = await this.exec(repo, org, rest).catch(e =>
      this.error(e.message),
    )
    this.log(format(resp.data, reporter!, formatSingleProject))
  }
}
