import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/passageiro/")({
  loader: () => {
    throw redirect({
      to: "/passageiro/boas-vindas",
    });
  },
});
