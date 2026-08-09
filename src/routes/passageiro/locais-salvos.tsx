import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/passageiro/locais-salvos')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/passageiro/locais-salvos"!</div>
}
