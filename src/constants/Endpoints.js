const apiRoot = 'http://pmt.dev/wp-json/sysapi/v1/'
const endpoints = {
  nodes: apiRoot + 'nodes',
  nodesGroups: apiRoot + 'nodes/groups',
  pagesNodes: apiRoot + 'collections/pagesnodes',
  users: apiRoot + 'users',
  usersLogin: apiRoot + 'users/login',
  usersLogout: apiRoot + 'users/logout',
  usersCreate: apiRoot + 'users/create',
  usersAvailability: apiRoot + 'users/available',
  permissions: apiRoot + 'admin/permissions',
};

export default endpoints;