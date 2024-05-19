/**
 * @file I18n initialization and configuration.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import { I18n } from 'i18n';
import path from 'path';

/**
 * @description I18n library.
 *
 * @exports Libraries/I18n
 */
const i18n = new I18n();

i18n.configure({
  locales: ['fr', 'en'],
  directory: path.join(process.cwd(), 'src/locales'),
  defaultLocale: process.env.DEFAULT_LOCALE,
  retryInDefaultLocale: false,
});

i18n.l = i18n.__; // eslint-disable-line no-underscore-dangle

export default i18n;
