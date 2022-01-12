import i18n from '$src/I18n';
import path from 'path';
import fs from 'fs';

describe('I18n', () => {
  it('Should have a configuration file', () => {
    const filePath = 'src/locales';
    const frenchConfFile = `${filePath}/fr.json`;
    const englishConfFile = `${filePath}/en.json`;

    const frenchFileExist = fs.existsSync(
      path.join(process.cwd(), frenchConfFile),
    );

    const englishFileExist = fs.existsSync(
      path.join(process.cwd(), englishConfFile),
    );

    expect(frenchFileExist).toBe(true);
    expect(englishFileExist).toBe(true);
  });

  it('Should look for locales on /src/locales folder', () => {
    expect(i18n.getCatalog('en')).toBeTruthy();
    expect(i18n.getCatalog('fr')).toBeTruthy();
  });

  it('Should retrieve default welcome message', () => {
    expect(i18n.l('WELCOME_CHANNEL_NAME')).toBe('Welcome');
  });
});
