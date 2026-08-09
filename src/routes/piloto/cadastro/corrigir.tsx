import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/piloto/cadastro/corrigir')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/piloto/cadastro/corrigir"!</div>
}
