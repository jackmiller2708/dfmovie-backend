export const selectQuery = [
  { $project: { __v: 0, isDeleted: 0 } },
  {
    $lookup: {
      from: 'userroles',
      localField: '_id',
      foreignField: 'role',
      pipeline: [
        { $project: { _id: 0, __v: 0, role: 0 } },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: { path: '$user' } },
        {
          $group: {
            _id: '$user._id',
            firstName: { $first: '$user.firstName' },
            lastName: { $first: '$user.lastName' },
            username: { $first: '$user.username' },
            email: { $first: '$user.email' },
            createdTime: { $first: '$user.createdTime' },
            updatedTime: { $first: '$user.updatedTime' },
          },
        },
      ],
      as: 'users',
    },
  },
];