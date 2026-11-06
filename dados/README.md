# Dados dos estudos do Heimdall News

Todos os dados usados nas páginas [Espectro político](../estudos/espectro.md) e [Câmara e Senado em cada governo](../mandatos/README.md), para quem quiser refazer as contas. Tudo vem de dados abertos oficiais da Câmara dos Deputados e do Senado Federal.

Baixe tudo de uma vez: https://github.com/luccasgois1/heimdall-news/archive/refs/heads/main.zip (a pasta `dados/`), ou arquivo por arquivo pelos links abaixo.

## Arquivos

### `votacoes/` — votações do Plenário e votos de cada parlamentar
CSV em UTF-8, compactado em gzip (abre no Excel/LibreOffice depois de descompactar, ou direto com `pandas.read_csv`). Um arquivo por casa e por ano, desde 2003.

- `<casa>-votacoes-<ano>.csv.gz`: uma linha por votação do Plenário. Colunas: `id` (identificador da votação na fonte), `data`, `descricao`, `proposicao` (só no Senado), `nominal` (1 = houve voto nominal; 0 = votação simbólica ou secreta, sem voto individual) e `orientacao_governo` (orientação do líder do governo, quando publicada: Sim, Não ou outro).
- `<casa>-votos-<ano>.csv.gz`: uma linha por voto. Colunas: `votacao` (o `id` acima), `parlamentar_id` (identificador do deputado ou senador na fonte), `nome`, `partido` (sigla na data da votação, normalizada como explicado abaixo), `uf` e `voto` (como a fonte registra: Sim, Não, Abstenção, Obstrução, Art. 17 etc.).
- `coleta.csv`: quando cada ano de cada casa foi baixado (`completo` = 1 quando o ano já estava encerrado na coleta; o ano corrente é baixado de novo a cada atualização).

**Como foram obtidos:**
- **Câmara:** arquivos anuais de dados abertos, baixados destes endereços (troque `<ano>`):
  - `https://dadosabertos.camara.leg.br/arquivos/votacoes/csv/votacoes-<ano>.csv` (votações; ficam só as do órgão `PLEN`, o Plenário);
  - `https://dadosabertos.camara.leg.br/arquivos/votacoesVotos/csv/votacoesVotos-<ano>.csv` (votos individuais: `idVotacao`, `deputado_id`, `deputado_nome`, `deputado_siglaPartido`, `deputado_siglaUf`, `voto`);
  - `https://dadosabertos.camara.leg.br/arquivos/votacoesOrientacoes/csv/votacoesOrientacoes-<ano>.csv` (orientação de bancada; fica a da bancada "Governo", "GOV." nos anos antigos).
  Os arquivos anuais são usados, e não a API, porque são completos.
- **Senado:** API de dados abertos, um trimestre por consulta (para anos antigos o ano inteiro não responde):
  - `https://legis.senado.leg.br/dadosabertos/votacao?dataInicio=<ano>-01-01&dataFim=<ano>-03-31` (e os outros trimestres): votações (`codigoSessaoVotacao`, `dataSessao`, `descricaoVotacao`, `identificacao`, `votacaoSecreta`) e votos (`codigoParlamentar`, `nomeParlamentar`, `siglaPartidoParlamentar`, `siglaUFParlamentar`, `siglaVotoParlamentar`). As votações secretas ficam sem voto individual (`nominal` = 0).
  - `https://legis.senado.leg.br/dadosabertos/plenario/votacao/orientacaoBancada/<ano>0101/<ano>1231`: orientação do líder do governo (só nos anos recentes).

**Tratamento:** além de filtrar o Plenário, só as siglas de partido são mudadas, para o mesmo partido ter o mesmo nome ao longo dos anos: PMDB → MDB, PPB e Progressistas → PP, PPS → CIDADANIA, PRB → REPUBLICANOS, PTN e Podemos → PODE, PT do B → AVANTE, SD → SOLIDARIEDADE, PSDC → DC, União Brasil → UNIÃO, PCDOB → PCdoB, S/Partido → "Sem partido". Fusões (como PFL/DEM → União) não são unidas.

### `configuracao/` — parâmetros da análise
- `presidentes.toml`: cada mandato presidencial (datas de exercício, pela galeria de ex-presidentes da Presidência da República) e os dois polos: a bancada do partido do presidente e a do principal partido de oposição.
- `espectro.toml`: os grupos, os limites das faixas de posição e os partidos de grupo fixo.

### `resultados/` — o que as páginas mostram
- `classificacao.json`: o grupo de cada partido, em cada casa, no mandato em curso (usado nos briefings).
- `mandatos/<id>.json`: os números de cada mandato e casa (partidos e parlamentares), os mesmos dos gráficos de [Câmara e Senado em cada governo](../mandatos/README.md).
- `espectro.json`: os números da página [Espectro político](../estudos/espectro.md).

## Como as contas são feitas
Com estes passos e só os arquivos desta pasta, os números das páginas se repetem (conferido nos governos Lula 3, nas duas casas, e Bolsonaro, na Câmara).

1. Para cada mandato e cada casa, entram as votações **nominais** do Plenário no período do mandato.
2. Uma votação é **disputada** quando o lado minoritário (Sim ou Não) teve pelo menos 10% dos votos Sim + Não. Só as disputadas entram (votações quase unânimes não distinguem ninguém).
3. Em cada votação disputada, o voto de um **polo** é o da maioria da bancada do partido do governo (ou da oposição), entre os que votaram Sim ou Não; empates não contam. Quando o partido do presidente mudou durante o mandato, vale o partido na data da votação (`ate` em `presidentes.toml`).
4. Para cada partido: a % das votações em que a maioria da bancada (sem empate) votou igual ao polo do governo e igual ao polo da oposição. A **posição** é (% igual à oposição) − (% igual ao governo): vai de −100 (sempre com o governo) a +100 (sempre com a oposição).
5. A posição cai numa das faixas de `espectro.toml` e dá o grupo (pró-governo, centro pró-governo, centro, centro-oposição, oposição); os partidos fixos têm grupo próprio.
6. Para cada parlamentar, as mesmas medidas, a fidelidade ao partido da época e a primeira dimensão de uma análise de componentes principais (sem âncora), como explicado em cada página.

Para conferir: baixe os arquivos originais nos endereços acima, aplique o filtro e as siglas, e compare com `votacoes/`; depois refaça os passos 1 a 5 e compare com `resultados/`.

## Contagens

| Casa | Ano | Votações | Votos individuais |
|---|---|---:|---:|
| Câmara | 2003 | [1024](votacoes/camara-votacoes-2003.csv.gz) | [11654](votacoes/camara-votos-2003.csv.gz) |
| Câmara | 2004 | [971](votacoes/camara-votacoes-2004.csv.gz) | [24578](votacoes/camara-votos-2004.csv.gz) |
| Câmara | 2005 | [727](votacoes/camara-votacoes-2005.csv.gz) | [17082](votacoes/camara-votos-2005.csv.gz) |
| Câmara | 2006 | [845](votacoes/camara-votacoes-2006.csv.gz) | [20870](votacoes/camara-votos-2006.csv.gz) |
| Câmara | 2007 | [816](votacoes/camara-votacoes-2007.csv.gz) | [40010](votacoes/camara-votos-2007.csv.gz) |
| Câmara | 2008 | [916](votacoes/camara-votacoes-2008.csv.gz) | [31414](votacoes/camara-votos-2008.csv.gz) |
| Câmara | 2009 | [1081](votacoes/camara-votacoes-2009.csv.gz) | [45242](votacoes/camara-votos-2009.csv.gz) |
| Câmara | 2010 | [604](votacoes/camara-votacoes-2010.csv.gz) | [22033](votacoes/camara-votos-2010.csv.gz) |
| Câmara | 2011 | [704](votacoes/camara-votacoes-2011.csv.gz) | [32531](votacoes/camara-votos-2011.csv.gz) |
| Câmara | 2012 | [864](votacoes/camara-votacoes-2012.csv.gz) | [22357](votacoes/camara-votos-2012.csv.gz) |
| Câmara | 2013 | [817](votacoes/camara-votacoes-2013.csv.gz) | [42841](votacoes/camara-votos-2013.csv.gz) |
| Câmara | 2014 | [570](votacoes/camara-votacoes-2014.csv.gz) | [24940](votacoes/camara-votos-2014.csv.gz) |
| Câmara | 2015 | [1424](votacoes/camara-votacoes-2015.csv.gz) | [112904](votacoes/camara-votos-2015.csv.gz) |
| Câmara | 2016 | [887](votacoes/camara-votacoes-2016.csv.gz) | [72053](votacoes/camara-votos-2016.csv.gz) |
| Câmara | 2017 | [1249](votacoes/camara-votacoes-2017.csv.gz) | [75813](votacoes/camara-votos-2017.csv.gz) |
| Câmara | 2018 | [787](votacoes/camara-votacoes-2018.csv.gz) | [45815](votacoes/camara-votos-2018.csv.gz) |
| Câmara | 2019 | [962](votacoes/camara-votacoes-2019.csv.gz) | [120364](votacoes/camara-votos-2019.csv.gz) |
| Câmara | 2020 | [1313](votacoes/camara-votacoes-2020.csv.gz) | [159717](votacoes/camara-votos-2020.csv.gz) |
| Câmara | 2021 | [1572](votacoes/camara-votacoes-2021.csv.gz) | [315581](votacoes/camara-votos-2021.csv.gz) |
| Câmara | 2022 | [1339](votacoes/camara-votacoes-2022.csv.gz) | [194863](votacoes/camara-votos-2022.csv.gz) |
| Câmara | 2023 | [1090](votacoes/camara-votacoes-2023.csv.gz) | [123242](votacoes/camara-votos-2023.csv.gz) |
| Câmara | 2024 | [2144](votacoes/camara-votacoes-2024.csv.gz) | [110462](votacoes/camara-votos-2024.csv.gz) |
| Câmara | 2025 | [2041](votacoes/camara-votacoes-2025.csv.gz) | [171217](votacoes/camara-votos-2025.csv.gz) |
| Câmara | 2026 | [1373](votacoes/camara-votacoes-2026.csv.gz) | [51916](votacoes/camara-votos-2026.csv.gz) |
| Senado | 2003 | [173](votacoes/senado-votacoes-2003.csv.gz) | [6804](votacoes/senado-votos-2003.csv.gz) |
| Senado | 2004 | [111](votacoes/senado-votacoes-2004.csv.gz) | [3805](votacoes/senado-votos-2004.csv.gz) |
| Senado | 2005 | [161](votacoes/senado-votacoes-2005.csv.gz) | [4779](votacoes/senado-votos-2005.csv.gz) |
| Senado | 2006 | [110](votacoes/senado-votacoes-2006.csv.gz) | [2754](votacoes/senado-votos-2006.csv.gz) |
| Senado | 2007 | [155](votacoes/senado-votacoes-2007.csv.gz) | [2754](votacoes/senado-votos-2007.csv.gz) |
| Senado | 2008 | [120](votacoes/senado-votacoes-2008.csv.gz) | [4122](votacoes/senado-votos-2008.csv.gz) |
| Senado | 2009 | [164](votacoes/senado-votacoes-2009.csv.gz) | [5182](votacoes/senado-votos-2009.csv.gz) |
| Senado | 2010 | [101](votacoes/senado-votacoes-2010.csv.gz) | [2349](votacoes/senado-votos-2010.csv.gz) |
| Senado | 2011 | [172](votacoes/senado-votacoes-2011.csv.gz) | [4453](votacoes/senado-votos-2011.csv.gz) |
| Senado | 2012 | [82](votacoes/senado-votacoes-2012.csv.gz) | [2916](votacoes/senado-votos-2012.csv.gz) |
| Senado | 2013 | [180](votacoes/senado-votacoes-2013.csv.gz) | [6156](votacoes/senado-votos-2013.csv.gz) |
| Senado | 2014 | [85](votacoes/senado-votacoes-2014.csv.gz) | [3321](votacoes/senado-votos-2014.csv.gz) |
| Senado | 2015 | [17](votacoes/senado-votacoes-2015.csv.gz) | [1215](votacoes/senado-votos-2015.csv.gz) |
| Senado | 2016 | [13](votacoes/senado-votacoes-2016.csv.gz) | [808](votacoes/senado-votos-2016.csv.gz) |
| Senado | 2017 | [146](votacoes/senado-votacoes-2017.csv.gz) | [5504](votacoes/senado-votos-2017.csv.gz) |
| Senado | 2018 | [112](votacoes/senado-votacoes-2018.csv.gz) | [2511](votacoes/senado-votos-2018.csv.gz) |
| Senado | 2019 | [133](votacoes/senado-votacoes-2019.csv.gz) | [4802](votacoes/senado-votos-2019.csv.gz) |
| Senado | 2020 | [193](votacoes/senado-votacoes-2020.csv.gz) | [9948](votacoes/senado-votos-2020.csv.gz) |
| Senado | 2021 | [225](votacoes/senado-votacoes-2021.csv.gz) | [11092](votacoes/senado-votos-2021.csv.gz) |
| Senado | 2022 | [169](votacoes/senado-votacoes-2022.csv.gz) | [6635](votacoes/senado-votos-2022.csv.gz) |
| Senado | 2023 | [141](votacoes/senado-votacoes-2023.csv.gz) | [4050](votacoes/senado-votos-2023.csv.gz) |
| Senado | 2024 | [95](votacoes/senado-votacoes-2024.csv.gz) | [4698](votacoes/senado-votos-2024.csv.gz) |
| Senado | 2025 | [128](votacoes/senado-votacoes-2025.csv.gz) | [4536](votacoes/senado-votos-2025.csv.gz) |
| Senado | 2026 | [59](votacoes/senado-votacoes-2026.csv.gz) | [1539](votacoes/senado-votos-2026.csv.gz) |

Os dados são públicos (Câmara dos Deputados e Senado Federal, dados abertos). Achou uma diferença? Abra uma issue em https://github.com/luccasgois1/heimdall-news/issues.
