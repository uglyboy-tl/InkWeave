declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.css" {
  const content: string;
  export default content;
}

declare module "@inkweave/react/react.css" {
  const content: string;
  export default content;
}

declare module "@inkweave/plugins/plugins.css" {
  const content: string;
  export default content;
}
