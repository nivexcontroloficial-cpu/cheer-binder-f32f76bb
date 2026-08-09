import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/passageiro/notificacoes')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/passageiro/notificacoes"!</div>
}
