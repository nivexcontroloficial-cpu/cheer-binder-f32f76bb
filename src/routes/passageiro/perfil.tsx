import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/passageiro/perfil')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/passageiro/perfil"!</div>
}
