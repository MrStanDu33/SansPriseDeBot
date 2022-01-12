import fs from 'fs';
import path from 'path';
import { logs, rolesTree } from '$src/Db';

describe('Db', () => {
  it('Should have roles tree configuration file', () => {
    const filePath = 'src/Db';
    const rolesTreePath = `${filePath}/rolesTree.json`;

    const rolesTreeFileExist = fs.existsSync(
      path.join(process.cwd(), rolesTreePath),
    );

    expect(rolesTreeFileExist).toBe(true);
  });

  it('Should have database file', () => {
    const filePath = 'src/Db';
    const JsonStoragePath = `${filePath}/JsonStorage.json`;

    const JsonStorageFileExist = fs.existsSync(
      path.join(process.cwd(), JsonStoragePath),
    );

    expect(JsonStorageFileExist).toBe(true);
  });

  it('Should load roles tree', () => {
    expect(rolesTree).toBeTruthy();
  });

  it('Should load json storage', () => {
    expect(logs).toBeTruthy();
  });
});
