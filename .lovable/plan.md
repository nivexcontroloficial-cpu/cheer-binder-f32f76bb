# Plan - Etapa 20.8I.C.1: Contrato de Preço, Cupom e Pagamento

Este plano implementa a centralização da lógica de cotação e pagamento para o fluxo do passageiro, garantindo que cupons (ROVYA5) e métodos de pagamento sejam preservados via Search Params em todas as telas, eliminando duplicações de dados.

## User Review Required

> [!IMPORTANT]
> A navegação agora dependerá de Search Params (`promoCode`, `paymentMethod`). Se o usuário recarregar a página, as informações serão mantidas. Links externos que não contenham esses parâmetros resetarão para os valores padrão (R$ 18,00 e Dinheiro).

## Proposed Changes

### Centralização e Tipagem
- [x] Criado `src/lib/passenger-demo-ride-quote.ts` com tipos, labels e lógica de cálculo.
- [ ] Integrar `rideQuoteSearchSchema` em todas as rotas relevantes.

### Refatoração de Dados (Fixtures)
- [x] Modificar `src/mocks/fixtures.ts` para importar `COMPLETED_PASSENGER_DEMO_RIDE` de `src/data/passenger-demo-rides.ts`, eliminando a duplicação do ID `RY-2026-00842`.

### Fluxo do Passageiro (Refatoração de Telas)
- **Confirmar Corrida**: Atualizar para injetar os parâmetros na navegação para "Buscando".
- **Buscando**: Preservar e repassar os parâmetros para a "Corrida Ativa".
- **Corrida Ativa / Em Andamento / Concluída**: Exibir preço e pagamento baseados no contrato central.
- **Histórico e Detalhes**: Ajustar para refletir a cotação da sessão atual quando acessado via fluxo.
- **Rotas Auxiliares (Chat, Segurança, etc.)**: Garantir que o retorno à corrida preserve a cotação.

### Validação e Qualidade
- Verificar estabilidade do `routeTree.gen.ts`.
- Executar testes de fumaça via Playwright para os cenários com e sem cupom.

## Technical Details

- **Módulo Central**: `src/lib/passenger-demo-ride-quote.ts` define `calculateRideFare` e `getQuoteParams`.
- **TanStack Router**: Uso de `validateSearch` com `rideQuoteSearchSchema` em múltiplas rotas.
- **Fixtures**: Mapeamento dinâmico da `DemoRide` para `Ride` no `ALL_RIDES`.
- **Preservação**: A cotação é "viva" nos Search Params, não persistida no banco ou localStorage (conforme requisito).

## Scalability
Este padrão permite adicionar novos cupons ou métodos de pagamento alterando apenas o arquivo de configuração central.
