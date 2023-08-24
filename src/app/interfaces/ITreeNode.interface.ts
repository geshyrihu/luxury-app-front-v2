export interface ITreeNode {
  // Node
  name: string;
  description?: string;
  image?: string;
  children: ITreeNode[];
  onClick?: () => void;
  // CSS (used for custom styling of individual nodes)
  cssClass?: string;
  css?: string;
}
