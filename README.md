# Black Friday Copafer · Copafer × 75 LAB

Apresentação HTML da proposta 75 LAB de **materiais de ponto de venda para a Black Friday 2026** das lojas Copafer de **Santo André** e **Mauá** (comunicação institucional, entrega nas lojas até 30/10/2026).

- **Link:** https://projetos.75lab.com.br/copafer-black-friday/

## Template

Construído a partir do KV da campanha ("Tire seus planos do papel."): vermelho Copafer, amarelo-limão, a etiqueta preta de Black Friday e o mascote. Fonte Montserrat. Uma página de rolagem com **6 telas limpas**:

1. **Capa** (vermelho): etiqueta Black Friday, tagline e o mascote recortado do KV.
2. **O desafio**: duas lojas gigantes, dez dias úteis; 42 peças, 20 essenciais, 38 prontas em até 5 dias úteis.
3. **O kit**: as 42 peças em 4 abas (lado de fora, entrada e teto, gôndolas e pallets, checkout e telas). Filtros combinados: prioridade em cima (P1, P2, P3 ou todas, ao lado do título) e área da loja embaixo (abas numeradas na ordem da loja, com a contagem da prioridade escolhida); abre em P1 e todas as áreas. Cada peça é um card com a imagem do material, área, prioridade, especificação, quantidade e prazo. Clicar na imagem amplia a peça (setas ou deslize passam pelas peças do filtro; Esc ou clique fora fecha).
4. **Cronograma**: cinco marcos até a entrega em 30/10.
5. **Investimento** (preto): kit essencial × kit completo, valores a preencher.
6. **Próximos passos** (vermelho) e contato.

Navegação em modo apresentação (telas a partir de 900 px): cada tela é um palco 16:9 de 1440 × 810 que escala para caber inteiro na janela, sem rolagem; uma tela por vez, com transição em cortina e a faixa amarela do KV; a roda do mouse não troca de tela. Avança com → ↓ PageDown espaço, volta com ← ↑ PageUp, Home/End vão ao início e ao fim; também pelas setas e pela barra de progresso no canto inferior direito, ou deslizando o dedo no tablet. No kit, as peças passam pelas setas da própria tela ou arrastando o carrossel. Deep link: `#s3`. No celular as telas viram rolagem vertical.

## Imagens das peças

As 41 peças visuais já têm imagem, recortadas das pranchas de mockups da campanha (o spot de rádio é áudio e mostra um card próprio). Para trocar ou incluir uma imagem, coloque o arquivo em `assets/pdv/` com o número e o nome da peça (lista completa em [assets/pdv/README.md](assets/pdv/README.md)), por exemplo `01-lona-de-fachada.jpg`, e rode o build. Formato do espaço: 4:3. Sem imagem, o card mostra o espaço reservado.

## Estrutura

```
index.html            apresentação (gerado)
assets/images/        KV da campanha e logos 75 LAB
assets/pdv/           imagens das peças (01-...42-)
src/
  01-head.html        título, fonte e todo o CSS
  02-slides.html      barra e as 6 telas
  03-script.html      lista das 42 peças, abas e carrossel do kit, tela ativa, teclado
build.ps1             gera index.html (e lê as imagens de assets/pdv/)
serve.ps1             servidor estático local opcional (http://localhost:8765)
```

Para mudar uma peça (nome, especificação, quantidade, prazo, prioridade), edite a lista `KIT` no início de `src/03-script.html`.

## Rebuild

```powershell
powershell -ExecutionPolicy Bypass -File .\build.ps1
```

## Pendências de conteúdo

- Logo oficial da Copafer: a barra usa o nome em tipografia sobre o amarelo do KV.
- Investimento: valores por frente nas duas opções, total, condições de pagamento e validade.
- Medidas e quantidades finais dependem da medição técnica nas duas lojas (até 20/10).

## Fontes

- https://www.copafer.com.br/conteudo/nossa-historia (consulta em 16/10/2026)
- https://www.copafer.com.br/ (consulta em 16/10/2026)
