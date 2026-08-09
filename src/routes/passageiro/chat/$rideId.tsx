import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/passageiro/chat/$rideId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/passageiro/chat/$rideId"!</div>
}
