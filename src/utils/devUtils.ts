export const devLogger = (message: string, ...args: any[]) => {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    console.log(`[Dev] ${message}`, ...args);
  }
};
