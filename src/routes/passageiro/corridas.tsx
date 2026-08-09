import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/passageiro/corridas')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/passageiro/corridas"!</div>
}
