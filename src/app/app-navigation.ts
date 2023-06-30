export const navigation = [
  {
    text: 'Dashboard',
    icon: 'chart',
    path: '/analytics-dashboard',
    // items: [
    //   {
    //     text: 'Dashboard',
    //     path: '/analytics-dashboard',
    //   },
    //   {
    //     text: 'Dashboard 2',
    //     path: '/analytics-sales-report',
    //   },
    //   {
    //     text: 'Viagens',
    //     path: '/analytics-geography',
    //   },
    // ],
  },
  {
    text: 'Clientes',
    icon: 'user',
    path: '',
    items: [
      {
        text: 'Listar',
        path: '/clientes',
      },
    ],
  },
  {
    text: 'Funcionarios',
    icon: 'user',
    path: '',
    items: [
      {
        text: 'Listar',
        path: '/funcionarios',
      },
    ],
  },
  {
    text: 'Planejamento',
    icon: 'event',
    path: '',
    items: [
      {
        text: 'Listar',
        path: '/planejamento',
      },
      {
        text: 'Task Details',
        path: '/planning-task-details',
      },
      {
        text: 'Agenda',
        path: '/agenda',
      },
    ],
  },
  {
    text: 'CRM',
    icon: 'user',
    path: '',
    items: [
      {
        text: 'Contact List',
        path: '/crm-contact-list',
      },
      {
        text: 'Contact Details',
        path: '/crm-contact-details',
      },
    ],
  },

  // {
  //   text: 'Analytics',
  //   icon: 'chart',
  //   path: '',
  //   items: [
  //     {
  //       text: 'Dashboard',
  //       path: '/analytics-dashboard',
  //     },
  //     {
  //       text: 'Sales Report',
  //       path: '/analytics-sales-report',
  //     },
  //     {
  //       text: 'Geography',
  //       path: '/analytics-geography',
  //     },
  //   ],
  // },
  // {
  //   text: 'Authentication',
  //   icon: 'card',
  //   path: '',
  //   items: [
  //     {
  //       text: 'Sign In Form',
  //       path: '/sign-in-form',
  //     },
  //     {
  //       text: 'Sign Up Form',
  //       path: '/sign-up-form',
  //     },
  //     {
  //       text: 'Reset Password Form',
  //       path: '/reset-password-form',
  //     }
  //   ],
  // },
  {
    text: 'Common',
    icon: 'box',
    path: '',
    items: [
      {
        text: 'User Profile',
        path: '/user-profile',
      },
    ]
  }
];
