import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/passageiro/corrida/$rideId/em-andamento',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/passageiro/corrida/$rideId/em-andamento"!</div>
}
