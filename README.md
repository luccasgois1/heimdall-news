# Heimdall News

A política do dia com a posição de cada campo em relação ao governo, e as fontes de tudo.

- **Site:** https://luccasgois1.github.io/heimdall-news
- **Vídeos:** https://www.youtube.com/@heimdallnews

Cada briefing traz os principais assuntos do dia, com o contexto factual e a posição de cada campo: pró-governo, centro pró-governo, centro, centro-oposição, oposição, independente (Missão/MBL) e outros. Também traz a atuação do Supremo Tribunal Federal, do Senado e da Câmara. Cada afirmação cita literalmente a fonte de onde saiu. Este repositório guarda todas as saídas de cada dia.

## O que tem aqui
- `briefing/AAAA-MM-DD/`: o briefing de cada dia em HTML (`AAAA-MM-DD.html`) e em Markdown (`AAAA-MM-DD.md`, que o GitHub mostra formatado). `briefing/index.html` é a página inicial do site.
- `img/AAAA-MM-DD/`: as imagens usadas no briefing do dia (a capa de cada assunto e a foto de quem fala).
- `videos.toml`: o link do vídeo de cada dia no YouTube, que aparece na página do dia.
- `audio/`: a narração do vídeo de cada dia (`AAAA-MM-DD.mp4`) e o roteiro com o tempo de cada fala (`AAAA-MM-DD.txt`).
- `estudos/espectro.html`: como cada partido foi posicionado no espectro, com as votações de cada governo desde 2003.
- `mandatos/`: a Câmara e o Senado em cada governo desde 2003, com partidos e parlamentares entre os polos de governo e oposição nas votações nominais.
- `dados/`: todos os dados usados no espectro e nos mandatos, para quem quiser refazer as contas. O [README da pasta](dados/README.md) diz como cada arquivo foi obtido.
- `.github/workflows/pages.yml`: publica o site no GitHub Pages a cada push.

Cada dia entra como um commit, então o histórico do repositório é o registro do acompanhamento. As citações e as imagens de capa pertencem aos veículos de origem, indicados e linkados em cada briefing.
