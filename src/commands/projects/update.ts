import { flags } from "@oclif/command"
import {
  format,
  reporterFlag,
  formatSingleProject,
} from "../../github/reporter"
import AuthCommand from "../../base"

const isStateString = (str: string | undefined): str is "open" | "closed" => {
  return ["open", "closed"].includes(str || "")
}

export default class ProjectsUpdate extends AuthCommand {
  public static description = "Update project."

  public static flags = {
    help: flags.help({ char: "h" }),
    project: flags.string({
      char: "p",
      description: "A project ID that you want to update.",
      required: true,
    }),
    name: flags.string({
      char: "n",
      description: "The name of project.",
      required: true,
    }),
    body: flags.string({
      char: "b",
      description: "The body of the project.",
    }),
    state: flags.string({
      char: "s",
      description: "State of the project.",
      options: ["open", "closed"],
    }),
    ...reporterFlag,
  }

  public async run() {
    const {
      flags: { reporter, project, help, state, ...rest },
    } = this.parse(ProjectsUpdate)

    if (!isStateString(state)) {
      // ignore, because this checks oclif.
      return
    }

    const resp = await this.client.projects
      .updateProject({
        id: project,
        project_id: project,
        state,
        ...rest,
      })
      .catch(e => this.error(e.message))

    this.log(format(resp.data, reporter!, formatSingleProject))
  }
}
