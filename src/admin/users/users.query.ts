export const selectQuery = [
  { $project: { __v: 0, isDeleted: 0 } },
  {
    $lookup: {
      from: 'userroles',
      localField: '_id',
      foreignField: 'user',
      pipeline: [
        { $project: { _id: 0, __v: 0, user: 0 } },
        {
          $lookup: {
            from: 'roles',
            localField: 'role',
            foreignField: '_id',
            as: 'role',
          },
        },
        { $unwind: { path: '$role' } },
        {
          $group: {
            _id: '$role._id',
            name: { $first: '$role.name' },
            permissions: { $first: '$role.permissions' },
            createdTime: { $first: '$role.createdTime' },
            updatedTime: { $first: '$role.updatedTime' },
          },
        },
      ],
      as: 'roles',
    },
  },
]