import { NbMenuItem } from "@nebular/theme";

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: "Dashboard",
    icon: "home-outline",
    link: "/dashboard",
    home: true
  },
  {
    title: "Distributor",
    icon: "people-outline",
    children: [
      {
        title: 'Browse Distributor',
        link: '/distributors/browse-distributor/list',
      }
    ]
  },
  {
    title: "Team",
    icon: "people-outline",
    children: [
      {
        title: 'My Team',
        link: '/team/myteam/list',
      },
      {
        title: 'Seller',
        link: '/team/seller/list',
      }
    ]
  },
  {
    title: "Retailers",
    icon: "archive-outline",
    children: [
      {
        title: 'Retailer',
        link: '/retailers/retailer/list',
      }
    ] 
  },
  {
    title: "Orders",
    icon: "shuffle-2-outline",
    children: [
      {
        title: "Manage Order",
        link: "/orders/list"
      },
      {
        title: "Create Order",
        link: "/orders/create"
      }
    ]
  },
  
  // {
  //   title: "Purchases",
  //   icon: "browser-outline",
  //   children: [
  //     {
  //       title: "Create PO",
  //       link: "/purchases/create"
  //     }
  //   ]
  // },
  {
    title: "Bills",
    icon: "pie-chart-outline",
    children: [
      {
        title: "Order Bills",
        link: "/bills/order/list"
      }
    ]
  },
  {
    title: "Products",
    icon: "cube-outline",
    children: [
      {
        title: "Manage Product",
        link: "/products/manager-products/order"
      },
      {
        title: "Warehouse ",
        link: "/products/warehouse/list"
      },
      // {
      //   title: "Manage Stock",
      //   link: "/products/stock/list"
      // },
      // {
      //   title: "Inventory Log",
      //   link: "/products/inventory/log"
      // },
      // {
      //   title: "Warehouse ",
      //   link: "/products/warehouse/list"
      // },
      // {
      //   title: "Product Group",
      //   link: "/products/group/list"
      // }
    ]
  },
  
  {
    title: "Messages",
    icon: "message-circle-outline",
    link: "/messages/list"
  },
  // {
  //   title: 'Sale Rep',
  //   icon: 'person-outline',
  //   link: '/sale-rep',
  //   children: [
  //     {
  //       title: 'My Sale Rep',
  //       link: '/sale-rep/list',
  //     },
  //   ]
  // },
  {
    title: 'Account',
    icon: 'person-done-outline',
    children: [
      {
        title: 'My Information',
        link: '/account/info/list',
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
