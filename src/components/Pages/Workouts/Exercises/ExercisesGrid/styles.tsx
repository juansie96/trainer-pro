import styled from 'styled-components'

export const ExercisesGridContainer = styled('div')(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  rowGap: '1em',
  columnGap: '1em',
  maxWidth: '100em',

  '@media (max-width: 1400px)': {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
}))

export const ExercisesCardContainer = styled('div')(() => ({
  height: 200,
  cursor: 'pointer',
  borderRadius: 2,
  position: 'relative' as const,
}))

export const ShadowBackground = styled('div')(() => ({
  boxShadow: '0px 0px 50px 11px rgba(0,0,0,0.75) inset',
  top: 0,
  width: '100%',
  height: '100%',
  position: 'absolute' as const,
}))

export const ExerciseImage = styled('img')(() => ({
  width: '100%',
  height: '100%',
}))

export const TagContainer = styled('div')(() => ({
  borderRadius: 1,
  padding: '0 0.25em',
  backgroundColor: '#769395',
  marginRight: '2px',
  flexWrap: 'wrap' as const,
}))

export const ExerciseDataContainer = styled('div')(() => ({
  position: 'absolute' as const,
  bottom: 10,
  left: 10,
}))
