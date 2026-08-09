import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/passageiro/destino')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/passageiro/destino"!</div>
}
