import fs from 'fs';
import path from 'path';
import { logs, formationRolesDecisionsTree } from '$src/Db';

describe('Db', () => {
  it('Should have roles tree configuration file', () => {
    const filePath = 'src/Db';
    const formationRolesDecisionsTreePath = `${filePath}/FormationRolesDecisionsTree.json`;

    const formationRolesDecisionsTreeFileExists = fs.existsSync(
      path.join(process.cwd(), formationRolesDecisionsTreePath),
    );

    expect(formationRolesDecisionsTreeFileExists).toBe(true);
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
    expect(formationRolesDecisionsTree).toBeTruthy();
  });

  it('Should load json storage', () => {
    expect(logs).toBeTruthy();
  });
});
