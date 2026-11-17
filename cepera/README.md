# Do prato à prova · 75LAB × Cepêra

Apresentação HTML do **Planejamento Estratégico 75LAB × Cepêra**: ocasião de consumo, exposição modular, execução de campo e mensuração, com **Mostarda com Mel 400 g** como produto demonstrador (hipótese a validar).

- **Abrir:** `cepera/index.html` (site estático, sem build)
- **AR no celular:** `cepera/ar.html?m=a|b|c`

## Narrativa

Abertura (trailer) → Capa → Agenda → **01 Leitura** (dois desafios, decupagem, públicos, sabemos × não sabemos) → **02 Contexto** (marca, produto, histórico de PDV, mercado, comportamento, concorrência pela escolha e pela contratação, públicos, jornada, perdas, tendências) → **03 Virada** (insights, tensão, oportunidade / como podemos) → **04 Solução** (estratégia, pilares, territórios, reveal do conceito, ecossistema, 3D/AR, clusters, vista explodida, inovações) → **Plano de Rastreamento 75LAB** (fluxo, One Shot × On Timing, ciclo de vida do ativo, demonstração app + painel) → **05 Execução** (benefícios, entregáveis, KPIs e avaliação, riscos, cronograma, oferta, síntese, próximo passo) → Encerramento → Fontes → Institucional.

Cada tela tem um título-takeaway (a conclusão, não o assunto).

## Navegação

| Ação | Teclas / gesto |
|---|---|
| Avançar | → ↓ PageDown Espaço · clique na tela · roda do mouse · deslizar |
| Voltar | ← ↑ PageUp · clique no terço esquerdo |
| Início / fim | Home / End |
| Índice de capítulos | M ou botão ☰ |
| Tela cheia | F |
| Imagem ampliada | clique na imagem · ← → na galeria · Esc ou clique fora fecha |
| Link direto | `index.html#/12` |

Abaixo de 900 px de largura (ou tablet em retrato) a apresentação vira rolagem vertical, com layouts reorganizados e animações disparadas pela rolagem.

## Arquitetura

HTML + CSS + JavaScript puro, sem framework e sem etapa de build.

```
cepera/
  index.html            todas as telas (seções .slide)
  ar.html               página leve de 3D/AR para abrir pelo QR code
  css/fonts.css         fontes locais (Big Shoulders Display, Outfit, Space Mono)
  css/style.css         sistema visual, animações, layouts e modo mobile
  js/icons.js           ícones SVG com microanimações em loop
  js/deck.js            navegação, transições, contadores, cursor, lightbox, 3D/AR sob demanda, fundo vivo
  vendor/               model-viewer 3.5.0 e qrcode-generator 1.4.4 (cópias locais)
  assets/brand/         logos Cepêra e 75LAB, grafismo concêntrico, favicon
  assets/images/        fotos de produto e receitas (cepera.com.br) e texturas do conceito
  assets/models/        GLB conceituais das configurações A, B e C
  assets/fonts/         woff2
  tools/build_models.py gera os GLB e as texturas (python3 + numpy + pillow)
```

- Animações em CSS (transições escalonadas por `--d`, desenho de SVG por `stroke-dashoffset`, tipografia cinética por palavra); JavaScript só orquestra estados.
- `model-viewer` só é carregado quando a apresentação se aproxima da tela de 3D.
- `prefers-reduced-motion` desliga loops e transições; aparelhos com poucos núcleos/memória entram em modo leve.

### Regerar os modelos 3D

```bash
cd cepera && python3 tools/build_models.py
```

## Pendências e validações

- **Apresentador:** nome, cargo, e-mail e telefone estão como `[preencher]` na última tela.
- **Linha do produto:** o planejamento cita Mostarda com Mel na linha *Mais Sabor*; a página do produto no site a descreve como “linha Sabores Cepêra” (nome que aparece no rótulo). Confirmar com a marca.
- **Exemplos de comunicação** (“Vai com a salada…”, “Vai com o salmão do jantar”, “Vai com a asinha do fim de semana”) são ilustrativos, sujeitos à aprovação da Cepêra.
- **Modelos 3D:** volumetria conceitual; medidas, materiais e carga dependem de levantamento e protótipo. Dimensões, GTIN e caixa de embarque do produto ainda não obtidos.
- **Painel da demonstração:** todos os números são simulados e estão marcados como tal.
- **Matriz de capacidade 75LAB** (Disponível / Configurável / Integrável / Em desenvolvimento) precisa ser preenchida antes da reunião.
- **Cronograma:** durações das fases a definir após a descoberta.
- Imagens de produto, receitas e logo pertencem à Cepêra (cepera.com.br), usadas aqui apenas para a proposta.

## Fontes

Lista completa na tela “Fontes” da apresentação (AAFC/Euromonitor, Kantar, cepera.com.br, Marcas pelo Mundo, Involves, ANPD e sites dos concorrentes citados).
