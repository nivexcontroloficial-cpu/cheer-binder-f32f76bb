import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/piloto/analise')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/piloto/analise"!</div>
}
