import { Env, getEnv } from "../config";

export const isDevelopment = (val: any): boolean => {
  return getEnv() === Env.Development;
};
