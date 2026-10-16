# Black Friday Copafer · Copafer × 75 LAB

Apresentação HTML da proposta 75 LAB de **materiais de ponto de venda para a Black Friday 2026** das lojas Copafer de **Santo André** e **Mauá** (comunicação institucional, entrega nas lojas até 30/10/2026).

- **Link:** https://projetos.75lab.com.br/copafer-black-friday/

## Template

Template próprio da Copafer, com a linguagem de sinalização de obra e de etiqueta de preço: preto, amarelo de sinalização, fita zebrada e tipografia Barlow (desenhada a partir de placas de estrada). É uma página de rolagem com **6 telas cheias**:

1. **Capa**
2. **O desafio** (amarelo): 42 peças por loja, 20 essenciais, 38 prontas em até 5 dias úteis, e os três critérios: institucional, rápido e assertivo.
3. **O kit**: as 42 peças em quatro áreas, da avenida ao caixa. Essenciais em amarelo, recomendadas com contorno e opcionais com contorno tracejado. Clicar numa peça mostra material, quantidade por loja e prazo.
4. **Cronograma** (calendário de outubro): quem aprova, quem cria, quando a gráfica produz e a entrega em 30/10.
5. **Investimento**: kit essencial × kit completo, com valores a preencher.
6. **Próximos passos** (amarelo) e contato.

Navegação: rolagem, setas ↑ ↓ ← →, PageUp/PageDown, Home/End e o índice lateral. Deep link: `#s3`. No celular as telas viram rolagem contínua e o detalhe da peça fica fixo no rodapé.

## Estrutura

```
index.html            apresentação (gerado)
assets/images/        logos 75 LAB (preto e lima)
src/
  01-head.html        título, fontes e todo o CSS
  02-slides.html      barra, índice e as 6 telas
  03-script.html      índice, tela ativa, teclado, animação de entrada e detalhe das peças
build.ps1             gera index.html
serve.ps1             servidor estático local opcional (http://localhost:8765)
```

HTML, CSS e JavaScript puros, sem dependências. Fontes via Google Fonts (Barlow e Barlow Condensed).

## Rebuild

```powershell
powershell -ExecutionPolicy Bypass -File .\build.ps1
```

Para editar as peças do kit, altere os botões `.pc` em `src/02-slides.html`: a classe `p1`/`p2`/`p3` define a prioridade e os atributos `data-m` (material e formato), `data-q` (quantidade por loja) e `data-t` (prazo) preenchem o detalhe.

## Pendências de conteúdo

- Logo oficial da Copafer: a barra usa o nome em tipografia até recebermos o arquivo.
- Investimento: valores por frente nas duas opções, total, condições de pagamento e validade (`R$ [__]`, `[a preencher]`).
- Apresentador: nome, cargo, e-mail e telefone.
- Medidas e quantidades finais dependem da medição técnica nas duas lojas (até 20/10).
- Prazos de produção são referências de mercado; confirmar no orçamento da gráfica.

## Fontes

- https://www.copafer.com.br/conteudo/nossa-historia (consulta em 16/10/2026)
- https://www.copafer.com.br/ (consulta em 16/10/2026)
