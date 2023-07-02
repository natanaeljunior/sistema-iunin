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
    path: '/clientes',
    // items: [
    //   {
    //     icon: 'bulletlist',
    //     text: 'Listar',
    //     path: '/clientes',
    //   },
    // ],
  },
  {
    text: 'Funcionarios',
    icon: 'card',
    path: '/funcionarios',
    // items: [
    //   {
    //     icon: 'bulletlist',
    //     text: 'Listar',
    //     path: '/funcionarios',
    //   },
    // ],
  },
  {
    text: 'Produtores',
    icon: 'user',
    path: '/produtores',
    // items: [
    //   {
    //     icon: 'bulletlist',
    //     text: 'Listar',
    //     path: '/funcionarios',
    //   },
    // ],
  },

  {
    text: 'Análises',
    icon: 'warning',
    path: '/analise',
    items: [
      {
        icon: 'fill',
        text: 'Leite',
        path: '/analise/leite',
      },
      {
        icon: 'product',
        text: 'Produto',
        path: '/analise/produto',
      },
      {
        icon: 'unpin',
        text: 'Vacinação',
        path: '/analise/vacinacao',
      },
      {
        icon: 'preferences',
        text: 'Parâmetros',
        path: '/analise/parametros',
      },
    ],
  },

  {
    text: 'Planejamento',
    icon: 'bulletlist',
    path: '/planejamento',
    items: [
      {
        icon:'detailslayout',
        text: 'Detalhes',
        path: '/planning-task-details',
      },
      {
        text: 'Agenda',
        icon: 'event',
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
];
