export type Category = {
  id: number;
  name: string;
  parentCategoryId: number | null;
  childrenCategories: Category[];
};

export const categories: Category[] = [
  {
    id: 1,
    name: 'Components',
    parentCategoryId: null,
    childrenCategories: [
      {
        id: 2,
        name: 'CPU',
        parentCategoryId: 1,
        childrenCategories: [
          {
            id: 3,
            name: 'Intel',
            parentCategoryId: 2,
            childrenCategories: [],
          },
          {
            id: 4,
            name: 'AMD',
            parentCategoryId: 2,
            childrenCategories: [],
          },
        ],
      },
      {
        id: 5,
        name: 'GPU',
        parentCategoryId: 1,
        childrenCategories: [
          {
            id: 6,
            name: 'NVIDIA',
            parentCategoryId: 5,
            childrenCategories: [],
          },
          {
            id: 7,
            name: 'AMD',
            parentCategoryId: 5,
            childrenCategories: [],
          },
        ],
      },
      {
        id: 8,
        name: 'Storage',
        parentCategoryId: 1,
        childrenCategories: [
          {
            id: 9,
            name: 'SSD',
            parentCategoryId: 8,
            childrenCategories: [],
          },
          {
            id: 10,
            name: 'HDD',
            parentCategoryId: 8,
            childrenCategories: [],
          },
        ],
      },
    ],
  },
  {
    id: 11,
    name: 'Peripherals',
    parentCategoryId: null,
    childrenCategories: [
      {
        id: 12,
        name: 'Monitors',
        parentCategoryId: 11,
        childrenCategories: [],
      },
      {
        id: 13,
        name: 'Keyboards',
        parentCategoryId: 11,
        childrenCategories: [],
      },
      {
        id: 14,
        name: 'Mice',
        parentCategoryId: 11,
        childrenCategories: [],
      },
    ],
  },
];
