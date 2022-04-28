export const getBoxShadow = is_hidden =>
  !is_hidden
    ? {
        startColor: '#00000009',
        finalColor: '#00000002',
        offset: [0, 5],
      }
    : {
        startColor: '#0000',
        finalColor: '#0000',
        offset: [0, 0],
        distance: 0,
        corners: [],
        sides: [],
        size: 0,
      };
