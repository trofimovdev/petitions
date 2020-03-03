export function isDevEnv() {
  return process.env.NODE_ENV === "development";
}

export function devLog(any) {
  if (isDevEnv()) {
    console.log(any);
  }
}
