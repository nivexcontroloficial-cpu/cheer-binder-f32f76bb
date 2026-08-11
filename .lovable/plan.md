# Plano de Ação - Chat Determinístico e Resiliente (Etapa 20.8G.1)

Refatoração do sistema de chat simulado para garantir mensagens determinísticas, sem duplicidade, remoção de anexos e conformidade com SSR/Acessibilidade.

## Alterações Técnicas

### 1. Chat do Passageiro (`src/routes/passageiro/chat/$rideId.tsx`)
- **Estado Inicial**: Remover `localStorage` e `useEffect` de hidratação. Usar um estado volátil inicializado com as 3 mensagens canônicas.
- **Mensagens Determinísticas**:
  - Piloto (10:30): "Olá Rafael, estou chegando ao local de embarque." (ID: "m1")
  - Passageiro (10:31): "Estou saindo!" (ID: "m2")
  - Piloto (10:31): "Perfeito, te aguardo no ponto de encontro combinado." (ID: "m3")
- **IDs e Horários**: Usar IDs fixos para o início. Novas mensagens usam contador `ref`. Horários iniciais são strings fixas ou datas estáticas para evitar mismatch de hidratação.
- **Remoção de Anexos**: Excluir `Paperclip`, `hasFakeAttachment`, UI de anexo e handlers relacionados.
- **Segurança e Timers**: Garantir que a resposta automática do piloto (se mantida) use `refs` para evitar disparos duplicados ou em rotas inválidas.
- **Acessibilidade**: Manter áreas de toque de 44px e nomes acessíveis.

### 2. Lista de Mensagens (`src/routes/passageiro/mensagens.tsx`)
- Atualizar a prévia da mensagem para a nova mensagem canônica: "Olá Rafael, estou chegando ao local de embarque."
- Manter horário determinístico ("10:30" ou "Agora").

## Verificação e Testes
- **Resiliência**: Recarregar a página e entrar/sair da rota para confirmar que a lista de mensagens não acumula.
- **SSR**: Validar que não há `Hydration Mismatch` removendo cálculos de datas dinâmicas no corpo do componente.
- **RideId Inválido**: Confirmar que a tela de erro é exibida sem mensagens ou timers ativos.
- **Tipagem**: Executar `tsc --noEmit` para validar a integridade técnica.
