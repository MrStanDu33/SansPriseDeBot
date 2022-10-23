/**
 * @file Seed discord server roles in database.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

/**
 * @module Seed:roles
 *
 * @category Binaries
 *
 * @subcategory Seed
 */

import Logger from '$src/Logger/index';
import Dotenv from 'dotenv';

Dotenv.config();

const rolesList = [
  {
    name: "[DAPy] Développeur d'application - Python",
    discordId: '646364551855603735',
  },
  {
    name: '[DW] Développeur Web',
    discordId: '654691713893531669',
  },
  {
    name: '[DSf] Développeur Salesforce',
    discordId: '646364040913879041',
  },
  {
    name: '[AL] Architecte logiciel',
    discordId: '646363430575669248',
  },
  {
    name: "[DAA] Développeur d'application - Android",
    discordId: '646364432271671298',
  },
  {
    name: '[DFE] Développeur Front-End',
    discordId: '761183139283468298',
  },
  {
    name: "[DAI] Développeur d'application - iOS",
    discordId: '646364509119971388',
  },
  {
    name: "[DAJ] Développeur d'application - Java",
    discordId: '646364729455017995',
  },
  {
    name: "[DAP/S] Développeur d'application - PHP/Symfony",
    discordId: '646364680968863775',
  },
  {
    name: '[DA] Data Analyst',
    discordId: '696173744153952356',
  },
  {
    name: '[DS] Data Scientist',
    discordId: '710834984503738430',
  },
  {
    name: '[IML] Ingénieur Machine Learning',
    discordId: '710835047694860347',
  },
  {
    name: '[DAr] Data Architect',
    discordId: '710835094084124693',
  },
  {
    name: '[IIA] Ingénieur IA',
    discordId: '710835144990130270',
  },
  {
    name: '[GP] Gestionnaire de paie',
    discordId: '790950208519405606',
  },
  {
    name: '[CGRH] Chargé de gestion des ressources humaines',
    discordId: '790950556277538866',
  },
  {
    name: '[MRH] Manager RH',
    discordId: '790950567437402144',
  },
  {
    name: '[RLD] Responsable Learning & Development',
    discordId: '790951033320505415',
  },
  {
    name: '[CEP] Conseiller en évolution professionnelle',
    discordId: '790951214992982016',
  },
  {
    name: "[CE] Créateur d'entreprise",
    discordId: '790951459520905236',
  },
  {
    name: '[MO] Manager opérationnel',
    discordId: '790951670598074378',
  },
  {
    name: '[AC] Attaché commercial',
    discordId: '790951788429836298',
  },
  {
    name: '[RPCSI] Responsable de Projets Cybersécurité et SI',
    discordId: '790952109423853608',
  },
  {
    name: '[ASR] Administrateur systèmes et réseaux',
    discordId: '648423968553828352',
  },
  {
    name: "[RSSI] Responsable en sécurité des systèmes d'information",
    discordId: '790952210607374367',
  },
  {
    name: '[TI] Technicien informatique',
    discordId: '750426997414690816',
  },
  {
    name: '[ESMC] Expert en stratégie marketing et communication',
    discordId: '790952665349750834',
  },
  {
    name: '[RMOC] Responsable marketing opérationnel et communication',
    discordId: '790952808740159508',
  },
  {
    name: '[CM] Community Manager',
    discordId: '790952977937596458',
  },
  {
    name: '[IRP] Ingénieur responsable pédagogique',
    discordId: '790954051948773376',
  },
  {
    name: '[FRPP] Formateur responsable de projets pédagogiques',
    discordId: '790954160160899133',
  },
  {
    name: '[CPD] Chef de projet digital',
    discordId: '679316012780224513',
  },
  {
    name: '[PM] Product Manager',
    discordId: '762993724590129223',
  },
  {
    name: '[UXD] UX Designer',
    discordId: '752055308594970624',
  },
  {
    name: 'Débutant sur Discord',
    discordId: '667286314802216962',
  },
  {
    name: 'Informé',
    discordId: '663666710611755018',
  },
  {
    name: "[PA] Prep'Apprentissage",
    discordId: '804722783963185213',
  },
  {
    name: '[PN] Passeport Numérique',
    discordId: '823199058234703922',
  },
  {
    name: '[CN] CléA numérique',
    discordId: '964163126310371398',
  },
  {
    name: '[M] Mentor',
    discordId: '648991513023479809',
  },
  {
    name: 'Diplômé',
    discordId: '705042042480492544',
  },
  {
    name: '(OLD) [DWJ] Développeur Web Junior',
    discordId: '646362171655323648',
  },
  {
    name: "(OLD) [PA] Prep'Android",
    discordId: '660482169139101727',
  },
  {
    name: "(OLD) [PW] Prep'Web",
    discordId: '646402911437324298',
  },
  {
    name: "(OLD) [FS] Prep'Full-Stack",
    discordId: '698474572122685451',
  },
  {
    name: '(OLD) [DFS] Développeur Full Stack',
    discordId: '698474572122685450',
  },
  {
    name: "(OLD) [DAFE] Développeur d'application - Front-End",
    discordId: '646364372045660181',
  },
  {
    name: 'Sans formation',
    discordId: '845283545676644363',
  },
];

/**
 * @description Save all roles in database.
 *
 * @returns { Promise<void> }
 */
const main = async () => {
  Logger.info('Start seeding roles in database');
  const models = (await import('$src/Models')).default;
  const { Role } = models;

  const promises = [];

  rolesList.forEach((role) => {
    const promise = Role.create(role);
    promises.push(promise);
  });

  await Promise.all(promises);

  Logger.info('Successfully seeded roles in database');
};

main();
