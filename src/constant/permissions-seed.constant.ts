export default class Permissions {
  public modules = [
    { name: 'USER', description: 'CRUD user' },
    { name: 'DESTINATION', description: 'CRUD destination' },
    { name: 'AMENITY', description: 'CRUD amenity' },
    { name: 'PROPERTY', description: 'CRUD property' },
    { name: 'ROOM', description: 'CRUD room' },
    { name: 'CATEGORY', description: 'CRUD category' },
    { name: 'USER_PERMISSION', description: 'CRUD user permission' },
    { name: 'PERMISSION', description: 'CRUD permission' },
    {
      name: 'OWNER_REGISTRATION',
      description: 'CRUD request of user that want to upgrade to owner'
    },
    { name: 'FAVORITE_PROPERTY', description: 'Favorite of property' },
    { name: 'BOOKING', description: 'Using booking the property' },
    { name: 'NOTIFICATION', description: 'CRUD notification' },
    { name: 'ROOMMATE', description: 'CRUD request find roommate of user' },
    { name: 'TRANSACTION', description: 'Manage invoice' }
  ];

  public methods = [
    { name: 'GET', description: 'Retrieve object' },
    { name: 'POST', description: 'Create object' },
    { name: 'PUT', description: 'Replace object' },
    { name: 'DELETE', description: 'Delete object' },
    { name: 'PATCH', description: 'Update object' },
    { name: 'GETLIST', description: 'Get list information' },
    { name: 'MANAGEROLE', description: 'Change role of user' },
    { name: 'RESTORE', description: 'Restore data was deleted' },
    {
      name: 'MANAGEPERMISSION',
      description: 'Create, delete and see information about permission of users'
    }
  ];

  public roles = [
    {
      name: 'ADMIN',
      description: 'Admin has all the permissions'
    },
    {
      name: 'MODERATOR',
      description: 'manage goods'
    },
    {
      name: 'OWNER',
      description: 'review order'
    },
    {
      name: 'USER',
      description: 'user'
    }
  ];

  public admin_role_permission = [
    {
      module: 'USER',
      methods: this.methods
    },
    {
      module: 'DESTINATION',
      methods: this.methods
    },
    {
      module: 'AMENITY',
      methods: this.methods
    },
    {
      module: 'PROPERTY',
      methods: this.methods
    },
    {
      module: 'ROOM',
      methods: this.methods
    },
    {
      module: 'CATEGORY',
      methods: this.methods
    },
    {
      module: 'USER_PERMISSION',
      methods: this.methods
    },
    {
      module: 'PERMISSION',
      methods: [{ name: 'GETLIST', description: 'Get list information' }]
    },
    {
      module: 'OWNER_REGISTRATION',
      methods: this.methods
    },
    {
      module: 'FAVORITE_PROPERTY',
      methods: this.methods
    },
    {
      module: 'BOOKING',
      methods: this.methods
    },
    {
      module: 'TRANSACTION',
      methods: this.methods
    },
    {
      module: 'ROOMMATE',
      methods: this.methods
    },
    {
      module: 'NOTIFICATION',
      methods: this.methods
    }
  ];

  public moderator_role_permission = [
    {
      module: 'USER',
      methods: [
        { name: 'GET', description: 'Retrieve object' },
        { name: 'GETLIST', description: 'Get list information' }
      ]
    },
    {
      module: 'DESTINATION',
      methods: this.methods
    },
    {
      module: 'AMENITY',
      methods: this.methods
    },
    {
      module: 'PROPERTY',
      methods: [
        { name: 'GET', description: 'Retrieve object' },
        { name: 'PUT', description: 'Replace object' },
        { name: 'DELETE', description: 'Delete object' },
        { name: 'PATCH', description: 'Update object' },
        { name: 'GETLIST', description: 'Get list information' },
        { name: 'MANAGEROLE', description: 'Change role of user' },
        { name: 'RESTORE', description: 'Restore data was deleted' },
      ]
    },
    {
      module: 'ROOM',
      methods: [
        { name: 'GET', description: 'Retrieve object' },
        { name: 'PUT', description: 'Replace object' },
        { name: 'DELETE', description: 'Delete object' },
        { name: 'PATCH', description: 'Update object' },
        { name: 'GETLIST', description: 'Get list information' },
        { name: 'MANAGEROLE', description: 'Change role of user' },
        { name: 'RESTORE', description: 'Restore data was deleted' },
      ]
    },
    {
      module: 'CATEGORY',
      methods: []
    },
    {
      module: 'USER_PERMISSION',
      methods: []
    },
    {
      module: 'FAVORITE_PROPERTY',
      methods: this.methods
    },
    {
      module: 'BOOKING',
      methods: [
        { name: 'GET', description: 'Retrieve object' },
        { name: 'GETLIST', description: 'Get list information' },
      ]
    },
    {
      module: 'TRANSACTION',
      methods: [
        { name: 'GET', description: 'Retrieve object' },
        { name: 'GETLIST', description: 'Get list information' },
      ]
    },
    {
      module: 'ROOMMATE',
      methods: this.methods
    },
    {
      module: 'NOTIFICATION',
      methods: this.methods
    },
    {
      module: 'OWNER_REGISTRATION',
      methods: this.methods
    }
  ];

  public owner_role_permission = [
    {
      module: 'USER',
      methods: [
        { name: 'GET', description: 'Retrieve object' },
        { name: 'GETLIST', description: 'Get list information' }
      ]
    },
    {
      module: 'DESTINATION',
      methods: [
        { name: 'GET', description: 'Retrieve object' },
        { name: 'GETLIST', description: 'Get list information' }
      ]
    },
    {
      module: 'AMENITY',
      methods: [
        { name: 'GET', description: 'Retrieve object' },
        { name: 'GETLIST', description: 'Get list information' }
      ]
    },
    {
      module: 'PROPERTY',
      methods: this.methods
    },
    {
      module: 'ROOM',
      methods: this.methods
    },
    {
      module: 'CATEGORY',
      methods: [
        { name: 'GET', description: 'Retrieve object' },
        { name: 'GETLIST', description: 'Get list information' }
      ]
    },
    {
      module: 'FAVORITE_PROPERTY',
      methods: [
        { name: 'GETLIST', description: 'Get list information' },
        { name: 'POST', description: 'Create object' }
      ]
    },
    {
      module: 'BOOKING',
      methods: [
        { name: 'POST', description: 'Create object' },
        { name: 'GETLIST', description: 'Get list information' }
      ]
    },
    {
      module: 'TRANSACTION',
      methods: [
        { name: 'GET', description: 'Retrieve object' },
        { name: 'GETLIST', description: 'Get list information' }
      ]
    },
    {
      module: 'ROOMMATE',
      methods: this.methods
    },
    {
      module: 'NOTIFICATION',
      methods: this.methods
    },
    {
      module: 'OWNER_REGISTRATION',
      methods: []
    },
  ];

  public user_role_permission = [
    {
      module: 'USER',
      methods: []
    },
    {
      module: 'DESTINATION',
      methods: [
        { name: 'GET', description: 'Retrieve object' },
        { name: 'GETLIST', description: 'Get list information' }
      ]
    },
    {
      module: 'AMENITY',
      methods: [
        { name: 'GET', description: 'Retrieve object' },
        { name: 'GETLIST', description: 'Get list information' }
      ]
    },
    {
      module: 'PROPERTY',
      methods: [
        { name: 'GET', description: 'Retrieve object' },
        { name: 'GETLIST', description: 'Get list information' }
      ]
    },
    {
      module: 'ROOM',
      methods: [
        { name: 'GET', description: 'Retrieve object' },
        { name: 'GETLIST', description: 'Get list information' }
      ]
    },
    {
      module: 'CATEGORY',
      methods: [
        { name: 'GET', description: 'Retrieve object' },
        { name: 'GETLIST', description: 'Get list information' }
      ]
    },
    {
      module: 'OWNER_REGISTRATION',
      methods: [{ name: 'POST', description: 'Create object' }]
    },
    {
      module: 'FAVORITE_PROPERTY',
      methods: [
        { name: 'POST', description: 'Create object' },
        { name: 'GETLIST', description: 'Get list information' }
      ]
    },
    {
      module: 'BOOKING',
      methods: [
        { name: 'GET', description: 'Retrieve object' },
        { name: 'POST', description: 'Create object' },
        { name: 'GETLIST', description: 'Get list information' }
      ]
    },
    {
      module: 'TRANSACTION',
      methods: []
    },
    {
      module: 'ROOMMATE',
      methods: this.methods
    },
    {
      module: 'NOTIFICATION',
      methods: this.methods
    }
  ];

  public role_permissions = [
    {
      role: 'ADMIN',
      permissions: this.admin_role_permission
    },
    {
      role: 'MODERATOR',
      permissions: this.moderator_role_permission
    },
    {
      role: 'OWNER',
      permissions: this.owner_role_permission
    },
    {
      role: 'USER',
      permissions: this.user_role_permission
    }
  ];
}
