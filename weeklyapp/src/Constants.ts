export const InterUIFont = { fontFamily: 'Inter UI' }

export const Background = '#F7F7F7'
export const BorderColor = '#E0E0E0'
export const Gray3 = '#BFBFBF'
export const Gray4 = '#7E7E7E'

export const Colors = {
  blackDark: '#252234',
  blackLight: '#313246',
  blackBorder: '#494A65',
  text: '#C3C5F2',
  textSecondary: '#C3C5F288',
}

export const GutterSize = 20
export const SmallGutter = 10

export const Shadow = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 3 },
  shadowRadius: 2,
  shadowOpacity: 0.25,
}

export const delay = (ns: number) =>
  new Promise((resolve) => setTimeout(resolve, ns))
