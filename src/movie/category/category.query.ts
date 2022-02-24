export const selectQuery = [
  { $project: { __v: 0, isDeleted: 0 } },
  {
    $lookup: {
      from: 'moviecategories',
      localField: '_id',
      foreignField: 'category',
      pipeline: [
        { $project: { _id: 0, __v: 0, category: 0 } },
        {
          $lookup: {
            from: 'movies',
            localField: 'movie',
            foreignField: '_id',
            as: 'movie',
          },
        },
        { $unwind: { path: '$movie' } },
        {
          $group: {
            _id: '$movie._id',
            title: { $first: '$movie.title' },
            translationKey: { $first: '$movie.translationKey' },
            createdTime: { $first: '$movie.createdTime' },
            updatedTime: { $first: '$movie.updatedTime' },
            poster: { $first: '$movie.poster' },
            description: { $first: '$movie.description' },
          },
        },
      ],
      as: 'movies',
    },
  },
]