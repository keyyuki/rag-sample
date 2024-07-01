import { existsSync, mkdirSync, renameSync } from 'fs';
import {} from 'path';

export function createDirectory(path: string) {
  const directories = path.split('/');
  let currentPath = '';
  for (const directory of directories) {
    currentPath += directory;
    if (!existsSync(currentPath)) {
      mkdirSync(currentPath);
    }

    currentPath += '/';
  }
}

export function moveFile(from: string, to: string) {
  // check if to path not existed, then create directory
  const directories = to.split('/');
  let currentPath = '';
  for (let i = 0; i < directories.length - 1; i++) {
    currentPath += directories[i];
    if (!existsSync(currentPath)) {
      mkdirSync(currentPath);
    }

    currentPath += '/';
  }
  renameSync(from, to);
}
