export const layouts = [
  {
    forLength: 3,
    layout: [
      /** 3 inline */
      {
        translate: -30,
        scale: 0.6,
        zIndex: 2,
        reverseZIndex: 1,
      },
      {
        translate: 0,
        scale: 1,
        zIndex: 3,
        reverseZIndex: 3,
      },
      {
        translate: 30,
        scale: 0.6,
        zIndex: 1,
        reverseZIndex: 2,
      },
    ],
  },
  {
    forLength: 4,
    layout: [
      /** 3 front, 1 back */
      {
        translate: -30,
        scale: 0.6,
        zIndex: 4,
        reverseZIndex: 4,
      },
      {
        translate: 0,
        scale: 1,
        zIndex: 3,
        reverseZIndex: 3,
      },
      {
        translate: 30,
        scale: 0.6,
        zIndex: 2,
        reverseZIndex: 2,
      },
      {
        translate: 0,
        scale: 0.35,
        zIndex: 1,
        reverseZIndex: 1,
      },
    ],
  },
  {
    forLength: 5,
    layout:
      /** 3 front, 2 back */
      [
        {
          translate: -30,
          scale: 0.6,
          zIndex: 4,
          reverseZIndex: 3,
        },
        {
          translate: 0,
          scale: 1,
          zIndex: 5,
          reverseZIndex: 5,
        },
        {
          translate: 30,
          scale: 0.6,
          zIndex: 3,
          reverseZIndex: 4,
        },
        {
          translate: 15,
          scale: 0.35,
          zIndex: 2,
          reverseZIndex: 2,
        },
        {
          translate: -15,
          scale: 0.35,
          zIndex: 1,
          reverseZIndex: 1,
        },
      ],
  },
];
