import { readFileSync } from "fs";
import { getEnv, Env } from "./env";
import { merge } from "./merge";
import { config as dotenvconfig } from "dotenv";

const file = process.env.SERVER_CONFIG ?? "server.config.json";
const data = JSON.parse(readFileSync(file).toString());

dotenvconfig({
  path: getEnv().toString() + ".env",
});

try {
  const envFile = getEnv().toString() + "." + file;
  const envData = JSON.parse(readFileSync(envFile).toString());
  merge(data, envData);
} catch {}

export const getConfig = (path: string, defaultVal: any = undefined): any => {
  const paths = path.split(":");
  let val = data;
  paths.forEach((p) => (val = val[p]));
  return val ?? defaultVal;
};

export const getSecret = (name: string) => {
  const secret = process.env[name];
  if (secret === undefined) {
    throw new Error(`Undefined secret ${name}`);
  }
  return secret;
};

export { getEnv, Env };
