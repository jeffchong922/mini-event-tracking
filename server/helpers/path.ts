import { resolve } from 'path';

export function resolveFromRunRoot(...paths: string[]) {
  return resolve(process.cwd(), ...paths);
}
