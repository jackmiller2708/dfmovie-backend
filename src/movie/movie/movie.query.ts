export const selectQuery = [
  { $project: { __v: 0, isDeleted: 0 } },
  {
    $lookup: {
      from: 'moviecategories',
      localField: '_id',
      foreignField: 'movie',
      pipeline: [
        { $project: { _id: 0, __v: 0, movie: 0 } },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },
        { $unwind: { path: '$category' } },
        {
          $group: {
            _id: '$category._id',
            name: { $first: '$category.name' },
            translationKey: { $first: '$category.translationKey' },
            createdTime: { $first: '$category.createdTime' },
            updatedTime: { $first: '$category.updatedTime' },
          },
        },
      ],
      as: 'categories',
    },
  },
]