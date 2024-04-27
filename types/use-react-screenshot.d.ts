declare module "use-react-screenshot" {
  export function useScreenshot(): [
    string,
    (node: HTMLElement) => Promise<string>
  ];
  export function createFileName(extension: string, name?: string): string;
}
