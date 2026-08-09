import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/passageiro/confirmar-corrida')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/passageiro/confirmar-corrida"!</div>
}
