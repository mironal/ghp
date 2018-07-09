ghp
===

A command line tool for GitHub Projects.


## Usage

- `ghp <sub-command> <action> [<options>]`

### Projects

- List repository projects
  - `ghp projects list (-—repo=<owner/repo>)`

- List organization projects
  - `ghp projects list (-—org=<org>)`

- Get a project
  - `ghp projects get (--project=<project-id>)`

- Create a repository project
  - `ghp projects create (-—repo=<owner/repo>) (—-name=<name>) [--body=<body>]`

- Create an organization project
  - `ghp projects create (-—org=<org>) (-—name=<name>) (--body=<body>)`

- Update a project
  - `ghp projects update (--name=<name>) (--body=<body>) --state`

- Delete a project
  - `ghp projects delete (--project=<project-id>)`

### Columns

- List project columns
  - `ghp columns list (--project=<project-id>)`

- Get a project column
  - `ghp columns get --column <column-id>`

- Create a project column
  - `ghp columns create --project <project-id> --name <name>`

- Update a project column
  - `ghp columns update --column <column-id> --name <name>`

- Delete a project column
  - `ghp columns delete (--column=<column-id>)`

- Move a project column
  - `ghp columns move (--position=<first|last|after:<column-id>>)`

### Cards

- List project cards
  - `ghp cards list (--column=<column-id>>)`

- Get a project card
  - `ghp cards get (--column=<column-id>) (--card=<card-id>>)`

- Create a project card
  - `ghp cards create (--column=<column-id>) (--note=<note> | --content=<issue-or-PR-id> --type=<PullRequest | Issue>)`

- Update a project card
  - `ghp cards update (--column=<column-id>) (--card=<column-id>>) --note=<note> --archived=<true | false>`

- Delete a project card
  - `ghp cards delete (--card=<card-id>>)`

- Move a project card
  - `ghp cards move (--card=<card-id>>) (--position=<top | bottom> | --after=<card-id>) --column=<column-id>`
