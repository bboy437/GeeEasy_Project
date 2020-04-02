import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [

  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/dashboard',
    home: true,
  },
  {
    title: 'Distributor',
    icon: 'people-outline',
    children: [
      {
        title: 'My Distributor',
        link: '/distributors/my-distributor/request/list',
      },
      {
        title: 'Browse Distributor',
        link: '/distributors/browse-distributor/list',
      },
      {
        title: 'Saved List',
        link: '/distributors/saved-lists',
      },
    ],
  },
  {
    title: 'Purchases',
    icon: 'browser-outline',
    children: [
      {
        title: 'Manage PO',
        link: '/purchases/list',
      },
      /*{
        title: 'Create PO',
        link: '/purchases/create',
      },*/
    ],
  },
  {
    title: 'Bills',
    icon: 'pie-chart-outline',
    link: '/bills/list',
  },
  {
    title: 'Products',
    icon: 'cube-outline',
    children: [
      {
        title: 'Manage Product',
        link: '/products/manage/list',
      },
      {
        title: 'Manage Stock',
        link: '/products/stock/list',
      },
      {
        title: 'Warehouse ',
        link: '/products/warehouse/list',
      },
      // {
      //   title: 'Product Group',
      //   link: '/products/group/list',
      // },
    ],
  },
  {
    title: 'Messages',
    icon: 'message-circle-outline',
    link: '/messages/list',
  },
  {
    title: 'Notification',
    icon: 'radio-outline',
    link: '/notifications/list',
  },
  // https://geeesyapiblueprint.docs.apiary.io/#reference/sale-rep/account/get-list
  // http://private-7cc4cf-geeesyapiblueprint.apiary-mock.com/salerep/account/lists?cur_page=1&per_page=10
  // http://private-7cc4cf-geeesyapiblueprint.apiary-mock.com/salerep/account/id/sale_rep_id
  // http://private-7cc4cf-geeesyapiblueprint.apiary-mock.com/salerep/account/create
  {
    title: 'Sale Rep',
    icon: 'person-outline',
    link: '/sale-rep',
    children: [
      {
        title: 'My Sale Rep',
        link: '/sale-rep/list',
      },
    ]
  },
  {
    title: 'Account',
    icon: 'person-done-outline',
    children: [
      {
        title: 'My Information',
        link: '/account/delivery-information/list',
      },
    ]
  },
  {
    title: "Reports",
    icon: "message-square-outline",
    link: "/reports"
  },
  {
    title: "File Manager",
    icon: "settings-outline",
    link: "/file-manager/list"
  }

];
