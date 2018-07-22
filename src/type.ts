export interface ResolveableCard {
  id: number
  note?: string
  content_url?: string
  issue?: {
    id: number
    number: number
    title: string
    assignees: Array<{ login: string }>
  } // trick !
}
