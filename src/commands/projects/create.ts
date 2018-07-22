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
      name: "target",
      required: true,
      description:
        "Repository name in `owner/repo` format or the name of organization.",
    },
  ]

  private exec = async (target: string, rest: any) => {
    if (target.includes("/")) {
      const [owner, repo] = target.split("/")
      return this.client.projects.createRepoProject({
        owner,
        repo,
        ...rest,
      })
    } else {
      return this.client.projects.createOrgProject({ org: target, ...rest })
    }
  }

  public async run() {
    const {
      args,
      flags: { reporter, ...rest },
    } = this.parse(ProjectsCreate)

    const { target } = args

    const resp = await this.exec(target, rest).catch(e => this.error(e.message))
    this.log(format(resp.data, reporter!, formatSingleProject))
  }
}
