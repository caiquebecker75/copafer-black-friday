# Black Friday Copafer · Copafer × 75 LAB

Apresentação HTML da proposta 75 LAB de **materiais de ponto de venda para a Black Friday 2026** das lojas Copafer de **Santo André** e **Mauá** (comunicação institucional, entrega nas lojas até 30/10/2026).

- **Proposta (13 telas):** https://agencia75lab.github.io/copafer-black-friday/

## Estrutura

```
index.html            apresentação (gerado)
assets/images/        logos e portfólio 75 LAB
src/
  01-head.html        título, fontes, tokens e CSS principal (paleta preto e amarelo)
  02-chrome.html      header com marcas, rodapé, capítulos, lightbox
  03-slides.html      as 13 telas e o CSS específico delas
  04-script.html      ícones animados, navegação, count-ups, kit interativo, fundo
build.ps1             gera index.html
serve.ps1             servidor estático local opcional (http://localhost:8765)
```

HTML, CSS e JavaScript puros, sem dependências. Fontes via Google Fonts (Archivo, Big Shoulders Display, Space Mono). Mesma base do projeto Lactalis na Operação, com a paleta trocada.

## Rebuild

```powershell
powershell -ExecutionPolicy Bypass -File .\build.ps1
```

## Uso

← → / espaço / PageUp/PageDown / roda do mouse / swipe / clique. `M` abre os capítulos. Deep link: `#s5`. Em telas ≤ 820 px a apresentação vira rolagem vertical.

## Roteiro

1. Capa · 2. 75 LAB e O Método 75 · 3. Agenda · 4. O desafio · 5. A estratégia (jornada em 5 pontos) · 6. O kit (reveal) · 7–10. O kit por área: outdoor; entrada, teto e corredores; gôndolas, pontas e pallets; checkout, equipe e telas · 11. Cronograma · 12. Proposta e investimento · 13. Encerramento.

Nas telas do kit, a lista mostra as peças essenciais (P1) com detalhes ao clicar; as recomendadas (P2) e opcionais (P3) ficam na nota abaixo. A lista completa das 42 peças, com especificações, está no documento de apoio (Word).

## Critério de cor

- **Preto:** momentos de marca e virada da história: capa, quem somos, a solução (reveal) e encerramento.
- **Off-white:** conteúdo de trabalho: agenda, desafio, estratégia, kit, cronograma e investimento.
- **Amarelo:** destaque de campanha. **Lima:** camada 75 LAB (dados e execução).

## Pendências de conteúdo

- Logo oficial da Copafer: o header e a capa usam o nome em tipografia até recebermos o arquivo.
- Investimento: valores por frente (kit essencial e kit completo), total, condições de pagamento e validade estão marcados `[a preencher]` / `R$ [__]`.
- Apresentador: nome, cargo, e-mail e telefone marcados `[preencher]`.
- Medidas e quantidades finais dependem da medição técnica nas duas lojas (até 20/10).
- Prazos de produção são referências de mercado; confirmar no orçamento da gráfica.

## Fontes

- https://www.copafer.com.br/conteudo/nossa-historia (consulta em 16/10/2026)
- https://www.copafer.com.br/ (consulta em 16/10/2026)
