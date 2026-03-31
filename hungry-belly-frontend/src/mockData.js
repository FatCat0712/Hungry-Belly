// Mock data for development/testing purposes

export const mockRoles = [
  {
    id: 1,
    name: "Admin",
    description: "Full system access with all permissions",
    isSystem: true,
    status: "active",
    userCount: 3,
    permissions: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ],
  },
  {
    id: 2,
    name: "Restaurant Manager",
    description: "Manage restaurant details, menus, and orders",
    isSystem: false,
    status: "active",
    userCount: 8,
    permissions: [2, 5, 9, 10, 11, 13, 14, 15],
  },
  {
    id: 3,
    name: "Customer Support",
    description: "Handle customer inquiries and order support",
    isSystem: false,
    status: "active",
    userCount: 5,
    permissions: [13, 14, 15, 16],
  },
  {
    id: 4,
    name: "Delivery Driver",
    description: "Manage order delivery tasks and updates",
    isSystem: false,
    status: "active",
    userCount: 12,
    permissions: [5, 14, 15],
  },
  {
    id: 5,
    name: "Viewer",
    description: "Read-only access to view data",
    isSystem: true,
    status: "archived",
    userCount: 0,
    permissions: [13, 16, 17, 18],
  },
];

export const mockPermissions = [
  // User Management
  {
    id: 1,
    resource: "users",
    action: "create",
    description: "Create new users",
  },
  {
    id: 2,
    resource: "users",
    action: "read",
    description: "View user information",
  },
  {
    id: 3,
    resource: "users",
    action: "update",
    description: "Edit user details",
  },
  {
    id: 4,
    resource: "users",
    action: "delete",
    description: "Delete users from system",
  },
  {
    id: 5,
    resource: "users",
    action: "reset_password",
    description: "Reset user passwords",
  },

  // Role Management
  {
    id: 6,
    resource: "roles",
    action: "create",
    description: "Create new roles",
  },
  {
    id: 7,
    resource: "roles",
    action: "read",
    description: "View role information",
  },
  {
    id: 8,
    resource: "roles",
    action: "update",
    description: "Edit role permissions",
  },
  {
    id: 9,
    resource: "roles",
    action: "delete",
    description: "Delete roles",
  },

  // Restaurant Management
  {
    id: 10,
    resource: "restaurants",
    action: "create",
    description: "Create new restaurants",
  },
  {
    id: 11,
    resource: "restaurants",
    action: "update",
    description: "Update restaurant details",
  },
  {
    id: 12,
    resource: "restaurants",
    action: "delete",
    description: "Delete restaurants",
  },

  // Order Management
  {
    id: 13,
    resource: "orders",
    action: "read",
    description: "View orders",
  },
  {
    id: 14,
    resource: "orders",
    action: "update",
    description: "Update order status",
  },
  {
    id: 15,
    resource: "orders",
    action: "cancel",
    description: "Cancel orders",
  },

  // Category Management
  {
    id: 16,
    resource: "categories",
    action: "read",
    description: "View categories",
  },
  {
    id: 17,
    resource: "categories",
    action: "create",
    description: "Create categories",
  },
  {
    id: 18,
    resource: "categories",
    action: "update",
    description: "Update categories",
  },
  {
    id: 19,
    resource: "categories",
    action: "delete",
    description: "Delete categories",
  },

  // Analytics
  {
    id: 20,
    resource: "analytics",
    action: "view",
    description: "View analytics and reports",
  },
];
