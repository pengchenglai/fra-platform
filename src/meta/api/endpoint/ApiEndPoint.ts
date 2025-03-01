const joinPaths = (...parts: Array<string>): string => `/${parts.join('/')}`
const apiPath = (...parts: Array<string>): string => joinPaths('api', ...parts)

export const ApiEndPoint = {
  init: () => apiPath('init'),
  definitions: (lang = ':lang', name = ':name', assessmentName = ':assessmentName', cycleName = ':cycleName') =>
    joinPaths('definitions', assessmentName, cycleName, lang, name),

  Admin: {
    users: () => apiPath('admin', 'users'),
    usersCount: () => apiPath('admin', 'users', 'count'),
  },

  Area: {
    country: () => apiPath('area', 'country'),
    countryProp: () => apiPath('area', 'country', 'prop'),
    areas: () => apiPath('area', 'areas'),
  },

  Assessment: {
    one: () => apiPath('assessment'),
  },

  Auth: {
    changePassword: () => apiPath('auth', 'change-password'),
    google: () => apiPath('auth', 'google'),
    googleCallback: () => apiPath('auth', 'google', 'callback'),
    login: () => joinPaths('auth', 'login'),
    logout: () => joinPaths('auth', 'logout'),
    resetPassword: () => joinPaths('auth', 'local', 'reset-password'),
  },

  CycleData: {
    descriptions: () => apiPath('cycle-data', 'descriptions'),
    activities: () => apiPath('cycle-data', 'activities'),

    OriginalDataPoint: {
      one: () => apiPath('cycle-data', 'original-data-points', 'original-data-point'),

      // Used for print view
      many: () => apiPath('cycle-data', 'original-data-points'),

      // Table Data (1a, 1b)
      data: () => apiPath('cycle-data', 'original-data-points', 'data'),
      reservedYears: () => apiPath('cycle-data', 'original-data-points', 'reserved-years'),
    },
    Review: {
      status: () => apiPath('cycle-data', 'review', 'status'),
      summary: () => apiPath('cycle-data', 'review', 'summary'),
    },
    Table: {
      estimate: () => apiPath('cycle-data', 'table', 'estimate'),
      nodes: () => apiPath('cycle-data', 'table', 'nodes'),
      tableData: () => apiPath('cycle-data', 'table', 'table-data'),
    },
  },

  ExtData: {
    Taxa: {
      search: () => apiPath('ext-data', 'taxa', 'search'),
    },
  },

  File: {
    biomassStock: () => apiPath('file', 'biomass-stock'),
    dashboard: () => apiPath('file', 'dashboard'),
    dataDownload: () => apiPath('file', 'data-download'),
    bulkDownload: () => apiPath('file', 'bulk-download'),
    userGuide: (language = ':language') => apiPath('file', 'user-guide', language),
    Assessment: {
      one: (uuid = ':uuid') => apiPath('file', 'assessment', uuid),
      many: () => apiPath('file', 'assessment'),
    },
  },

  MessageCenter: {
    topic: () => apiPath('message-center', 'topic'),
    topicMessage: () => apiPath('message-center', 'topic', 'message'),
    topicResolve: () => apiPath('message-center', 'topic', 'resolve'),
    topicUnreadMessages: () => apiPath('message-center', 'topic', 'unread-messages'),
  },

  User: {
    many: () => apiPath('users'),
    one: () => apiPath('users', 'user'),

    invite: () => apiPath('users', 'invite'),
    invitation: () => apiPath('users', 'invitation'),
    invitationAccept: () => apiPath('users', 'invitation', 'accept'),
    invitationSendEmail: () => apiPath('users', 'invitation', 'send-email'),

    resetPassword: () => apiPath('users', 'reset-password'),

    profilePicture: (id = ':id') => apiPath('users', 'profile-picture', id),
    roles: () => apiPath('users', 'roles'),
    adminRole: () => apiPath('users', 'admin-role'),
    sectionAuth: () => apiPath('users', 'section-auth'),
  },

  Geo: {
    sepalProxy: () => apiPath('geo', 'sepal'),
    Layers: {
      getForest: () => apiPath('geo', 'layers', 'forest'),
      getForestAgreement: () => apiPath('geo', 'layers', 'forestAgreement'),
      getBoundaries: () => apiPath('geo', 'layers', 'boundaries'),
      getEstimations: () => apiPath('geo', 'estimations', 'forest'),
    },
  },

  MetaData: {
    sectionsMetadata: () => apiPath('metadata', 'sections', 'metadata'),
    sections: () => apiPath('metadata', 'sections'),
  },
}
