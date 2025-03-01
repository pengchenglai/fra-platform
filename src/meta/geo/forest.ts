export interface ForestOptions {
  selected: ForestSource[]
  fetchedLayers: { [key: string]: string }
  opacity: { [key: string]: number }
  hansenPercentage: HansenPercentage
  agreementLayerSelected: boolean
  agreementLevel: number
}

export const hansenPercentages = [10, 20, 30] as const

export type HansenPercentage = typeof hansenPercentages[number]

export interface ForestSourceWithOptions {
  key: ForestSource
  options: {
    [key: string]: string
  }
}

export enum ForestSource {
  JAXA = 'JAXA',
  TandemX = 'TandemX',
  GlobeLand = 'GlobeLand',
  ESAGlobCover = 'ESAGlobCover',
  Copernicus = 'Copernicus',
  ESRI = 'ESRI',
  ESAWorldCover = 'ESAWorldCover',
  Hansen = 'Hansen',
  MODIS = 'MODIS',
}

export type Layer = {
  mapId: string
  palette: Array<string>
  year?: number
  scale?: number
  citation?: string
}

export const precalForestAgreementSources: Array<ForestSource> = [
  ForestSource.JAXA,
  ForestSource.TandemX,
  ForestSource.GlobeLand,
  ForestSource.ESAGlobCover,
  ForestSource.Copernicus,
  ForestSource.ESRI,
  ForestSource.ESAWorldCover,
  ForestSource.Hansen, // precal with tree cover gte 10,20,30%
]

export const sourcesMetadata = {
  [ForestSource.JAXA]: {
    scale: 24.7376,
    palette: ['#800080'], // purple
    citation: 'https://doi.org/10.1016/j.rse.2014.04.014', // from gee asset
    forestAreaDataProperty: 'faJaxa',
  },
  [ForestSource.TandemX]: {
    scale: 55.6597,
    palette: ['#008000'], // green
    citation: 'https://geoservice.dlr.de/web/dataguide/fnf50/',
    forestAreaDataProperty: 'faTandemx',
  },
  [ForestSource.ESAGlobCover]: {
    scale: 309.2208,
    palette: ['#FF0000'], // red
    citation: 'http://due.esrin.esa.int/page_globcover.php', // from gee asset
    forestAreaDataProperty: 'faEsa2009',
  },
  [ForestSource.GlobeLand]: {
    scale: 30,
    palette: ['#0000FF'], // blue
    citation: 'http://www.globallandcover.com/home_en.html', // official web site
    forestAreaDataProperty: 'faGlobeland',
  },
  [ForestSource.Copernicus]: {
    scale: 100,
    palette: ['#FFFF00'], // yellow
    citation: ' https://doi.org/10.3390/rs12061044', // from gee asset
    forestAreaDataProperty: 'faCopernicus',
  },
  [ForestSource.ESRI]: {
    scale: 10,
    palette: ['#FF7F50'], // coral
    citation: ' https://www.arcgis.com/home/item.html?id=d6642f8a4f6d4685a24ae2dc0c73d4ac',
    forestAreaDataProperty: 'faEsri',
  },
  [ForestSource.ESAWorldCover]: {
    scale: 10,
    palette: ['#00ffff'], // cyan
    citation: 'https://esa-worldcover.org/en', // on gee citation 'A publication is under preparation'
    forestAreaDataProperty: 'faEsa2020',
  },
  [ForestSource.Hansen]: {
    scale: 30.92,
    palette: ['#00ff00'], // lime
    citation: 'https://doi.org/10.1126/science.1244693', // from gee asset
    forestAreaDataProperty: 'faHansen',
  },
  [ForestSource.MODIS]: {
    scale: 231.6563,
    palette: ['#FFD700'], // gold
    citation: 'https://lpdaac.usgs.gov/products/mod44bv006/',
  },
}

export const agreementPalette = [
  '#FFC0CB', // pink
  '#FF0000', // red
  '#FF8000', // shade of brown
  '#FFFF00', // yellow
  '#01def9', // shade of cyan
  '#0040FF', // shade of blue
  '#01DF01', // shade of green
  '#0B3B0B', // very dark shade of green
  '#808080', // gray
  '#800080', // purple
  '#000000', // black
]

const forestAgreementRecipes: Array<{
  layers: Array<ForestSource>
  gteHansenTreeCoverPerc?: number
  forestAreaDataProperty: string
}> = [
  {
    layers: [
      ForestSource.TandemX,
      ForestSource.JAXA,
      ForestSource.GlobeLand,
      ForestSource.ESAGlobCover,
      ForestSource.Copernicus,
      ForestSource.ESRI,
      ForestSource.ESAWorldCover,
      ForestSource.Hansen,
    ],
    gteHansenTreeCoverPerc: 10,
    forestAreaDataProperty: 'faAgreementHansen10',
  },
  {
    layers: [
      ForestSource.JAXA,
      ForestSource.TandemX,
      ForestSource.GlobeLand,
      ForestSource.ESAGlobCover,
      ForestSource.Copernicus,
      ForestSource.ESRI,
      ForestSource.ESAWorldCover,
      ForestSource.Hansen,
    ],
    gteHansenTreeCoverPerc: 20,
    forestAreaDataProperty: 'faAgreementHansen20',
  },
  {
    layers: [
      ForestSource.JAXA,
      ForestSource.TandemX,
      ForestSource.GlobeLand,
      ForestSource.ESAGlobCover,
      ForestSource.Copernicus,
      ForestSource.ESRI,
      ForestSource.ESAWorldCover,
      ForestSource.Hansen,
    ],
    gteHansenTreeCoverPerc: 30,
    forestAreaDataProperty: 'faAgreementHansen30',
  },
  {
    layers: [ForestSource.ESRI, ForestSource.ESAWorldCover, ForestSource.GlobeLand, ForestSource.Hansen],
    gteHansenTreeCoverPerc: 10,
    forestAreaDataProperty: 'faAgreementEsriEsaGloHansen10',
  },
  {
    layers: [ForestSource.ESRI, ForestSource.ESAWorldCover],
    forestAreaDataProperty: 'faAgreementEsriEsa',
  },
]

export const getRecipeAgreementAreaProperty = (
  selectedLayers: Array<ForestSource>,
  gteAgreementLevel: number,
  gteHansenTreeCoverPerc?: number
): string => {
  const recipe = forestAgreementRecipes.find((recipe) => {
    return (
      recipe.layers.length === selectedLayers.length &&
      (recipe.gteHansenTreeCoverPerc === gteHansenTreeCoverPerc || recipe.gteHansenTreeCoverPerc === undefined) &&
      recipe.layers.every((layer) => selectedLayers.includes(layer))
    )
  })

  return recipe === undefined ? null : `${recipe.forestAreaDataProperty}Gte${gteAgreementLevel}`
}
