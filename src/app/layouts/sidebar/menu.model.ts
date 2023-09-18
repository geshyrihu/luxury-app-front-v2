// export interface MenuItem {
//   id?: number;
//   label?: any;
//   icon?: string;
//   link?: string;
//   subItems?: any;
//   isTitle?: boolean;
//   badge?: any;
//   parentId?: number;
//   isLayout?: boolean;
//   visible?: boolean;
// }
export interface MenuItem {
  visible: boolean;
  label: string;
  icon?: string;
  link?: string;
  name?: string;
  subItems?: SubMenuItem[];
}

export interface SubMenuItem {
  visible: boolean;
  label: string;
  link?: string;
  name?: string;
  subItems?: SubMenuItems[];
}

export interface SubMenuItems {
  visible: boolean;
  label: string;
  link: string;
  name: string;
}
