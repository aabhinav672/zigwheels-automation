import * as fs from 'fs';
import * as path from 'path';

const DATA_ROOT = path.resolve(__dirname, '..', '..', 'test-data');

/**
 * Loads a JSON file from `test-data/`. Data-driven specs call this at module
 * scope so the parametrised cases are known before the run starts.
 *
 * @param fileName File name relative to test-data, with or without `.json`.
 */
export function readJson<T>(fileName: string): T {
  const withExt = fileName.endsWith('.json') ? fileName : `${fileName}.json`;
  const fullPath = path.join(DATA_ROOT, withExt);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Test data file not found: ${fullPath}`);
  }

  try {
    return JSON.parse(fs.readFileSync(fullPath, 'utf-8')) as T;
  } catch (error) {
    throw new Error(`Test data file ${withExt} is not valid JSON: ${(error as Error).message}`);
  }
}

/** Picks one named record out of a keyed data file. */
export function readRecord<T>(fileName: string, key: string): T {
  const bundle = readJson<Record<string, T>>(fileName);
  if (!(key in bundle)) {
    throw new Error(
      `Key "${key}" not found in ${fileName}. Available: ${Object.keys(bundle).join(', ')}`,
    );
  }
  return bundle[key];
}
