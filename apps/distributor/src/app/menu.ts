import { NbMenuItem } from "@nebular/theme";

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: "Dashboard",
    icon: "home-outline",
    link: "/dashboard",
    home: true
  },
  {
    title: "Suppliers",
    icon: "people-outline",
    children: [
      {
        title: "My Suppliers",
        link: "/suppliers/my-suppliers/list"
      },
      {
        title: "Browse Suppliers",
        link: "/suppliers/browse-suppliers"
      },
      {
        title: "Saved Lists",
        link: "/suppliers/saved-lists"
      }
    ]
  },
  {
    title: "Purchases",
    icon: "browser-outline",
    children: [
      {
        title: "Manage PO",
        link: "/purchases/list"
      },
      {
        title: "Create PO",
        link: "/purchases/create"
      }
    ]
  },
  {
    title: "Check-In",
    icon: "checkmark-square-2-outline",
    link: "/check-in/list"
  },
  {
    title: "Bills",
    icon: "pie-chart-outline",
    link: "/bills/list"
  },
  {
    title: "Products",
    icon: "cube-outline",
    children: [
      {
        title: "Manage Product",
        link: "/products/manage/list"
      },
      {
        title: "Manage Stock",
        link: "/products/stock/list"
      },
      {
        title: "Inventory Log",
        link: "/products/inventory/log"
      },
      {
        title: "Warehouse ",
        link: "/products/warehouse/list"
      },
      {
        title: "Product Group",
        link: "/products/group/list"
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
  {
    title: "Dealers",
    icon: "grid-outline",
    link: "/dealers/list"
  },
  {
    title: "Messages",
    icon: "message-circle-outline",
    link: "/messages/list"
  },
  {
    title: "Notification",
    icon: "radio-outline",
    link: "/notifications/list"
  },
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
