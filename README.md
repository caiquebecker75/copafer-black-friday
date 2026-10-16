# Black Friday Copafer · Copafer × 75 LAB

Apresentação HTML da proposta 75 LAB de **materiais de ponto de venda para a Black Friday** das lojas Copafer de **Santo André** e **Mauá** (comunicação institucional).

- **Link:** https://projetos.75lab.com.br/copafer-black-friday/

## Template

Construído a partir do KV da campanha ("Tire seus planos do papel."): vermelho Copafer, amarelo-limão, a etiqueta preta de Black Friday e o mascote. Fonte Montserrat. **6 telas limpas**, sem datas nem prazos:

1. **Capa** (vermelho): etiqueta Black Friday, tagline e o mascote recortado do KV.
2. **O desafio**: duas lojas gigantes, um só kit; 24 peças por loja, 14 essenciais, 4 áreas da loja.
3. **O kit**: as 24 peças. Filtros combinados: prioridade em cima (P1, P2, P3 ou todas, ao lado do título) e área da loja embaixo (abas numeradas na ordem da loja, com a contagem da prioridade escolhida); abre em P1 e todas as áreas. Cada peça é um card com a imagem do material, área, prioridade, especificação e quantidade. Clicar na imagem amplia a peça (setas ou deslize passam pelas peças do filtro; Esc ou clique fora fecha).
4. **Visão geral** (branco): as 24 peças numa tela só, em 4 colunas (uma por área da loja), com imagem, nome, substrato, prioridade e quantidade. Montada pelo script a partir da lista `KIT`; clicar na imagem amplia, e as setas passam por todas as peças.
5. **Quantidade por loja** (vermelho): as 18 peças com quantidade definida, do maior para o menor número, e as 6 que seguem uma regra: pela estrutura da loja (lona de fachada, pórtico, wind banner) e arquivos digitais (modelos de cartaz, vídeo, spot de rádio).
6. **Encerramento** (preto): contato comercial da Vanessa Morelli (Diretora Comercial, e-mail e telefone) e os canais da 75 LAB (site, e-mail e Instagram).

Navegação em modo apresentação (telas a partir de 900 px): cada tela é um palco 16:9 de 1440 × 810 que escala para caber inteiro na janela, sem rolagem; uma tela por vez, com transição em cortina e a faixa amarela do KV; a roda do mouse não troca de tela. Avança com → ↓ PageDown espaço, volta com ← ↑ PageUp, Home/End vão ao início e ao fim; também pelas setas e pela barra de progresso no canto inferior direito, ou deslizando o dedo no tablet. No kit, as peças passam pelas setas da própria tela ou arrastando o carrossel. Deep link: `#s3`. No celular as telas viram rolagem vertical.

## Imagens das peças

As 23 peças visuais já têm imagem, recortadas das pranchas de mockups da campanha (o spot de rádio é áudio e mostra um card próprio). Para trocar ou incluir uma imagem, coloque o arquivo em `assets/pdv/` com o número e o nome da peça (lista completa em [assets/pdv/README.md](assets/pdv/README.md)), por exemplo `01-lona-de-fachada.jpg`, e rode o build. Formato do espaço: 4:3. Sem imagem, o card mostra o espaço reservado.

## Estrutura

```
index.html            apresentação (gerado)
assets/images/        KV da campanha e logos 75 LAB
assets/pdv/           imagens das peças (01-...24-)
src/
  01-head.html        título, fonte e todo o CSS
  02-slides.html      barra e as 6 telas
  03-script.html      lista das 24 peças, filtros e carrossel do kit, visão geral, imagem ampliada, navegação
build.ps1             gera index.html (e lê as imagens de assets/pdv/)
serve.ps1             servidor estático local opcional (http://localhost:8765)
```

Para mudar uma peça (nome, substrato, especificação, quantidade, prioridade), edite a lista `KIT` no início de `src/03-script.html`; o kit e a visão geral se atualizam juntos. A grade da tela 5 e as contagens da tela 2 estão escritas em `src/02-slides.html`.

## Rebuild

```powershell
powershell -ExecutionPolicy Bypass -File .\build.ps1
```

## Pendências de conteúdo

- Logo oficial da Copafer: a barra usa o nome em tipografia sobre o amarelo do KV.
- Medidas finais e a quantidade das peças pela estrutura da loja (lona de fachada, pórtico, wind banner) dependem da medição técnica nas duas lojas.

## Fontes

- https://www.copafer.com.br/conteudo/nossa-historia
- https://www.copafer.com.br/
