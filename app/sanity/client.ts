import PicoSanity from 'picosanity'

export const config = {
  projectId: '6h1mv88x',
  dataset: 'production',
  apiVersion: '2022-03-25',
}

export default new PicoSanity({
  ...config,
  useCdn: true,
})
