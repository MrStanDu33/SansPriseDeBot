/**
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import { I18n } from 'i18n';
import path from 'path';

const i18n = new I18n();

i18n.configure({
  locales: ['fr', 'en'],
  directory: path.join(process.cwd(), 'src/locales'),
  defaultLocale: process.env.DEFAULT_LOCALE,
  retryInDefaultLocale: false,
});
// eslint-disable-next-line no-underscore-dangle
i18n.l = i18n.__;

export default i18n;
