/**
 * @file Seed discord server roles in database.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @category Binary
 */

import Logger from '$src/Logger/index';
import Dotenv from 'dotenv';
import FormationRolesDecisionsTree from '../../src/Db/DecisionsTrees/FormationRolesDecisionsTree.json' assert { type: 'json' };

Dotenv.config();

const models = (await import('$src/Models')).default;
const { Role } = models;

// TODO: Refactor to static class

/**
 * @typedef { object } BaseRole
 *
 * @property { string } name   - Name of the discord role.
 * @property { string } roleId - Id of the discord role.
 */

/**
 * @function processRole
 *
 * @description Process all given roles, recursively.
 *
 * @param   { BaseRole[] | [][] } roles - A collection of roles to save.
 *
 * @returns { Promise<Role>[] }         List off all models instances promises.
 */
const processRoles = (roles) =>
  roles.map((role) => {
    if (role.roleId === undefined) {
      const rolesList = Object.values(role);
      return processRoles(rolesList);
    }
    return Role.create({
      name: role.name,
      discordId: role.roleId,
    });
  });

/**
 * @function main
 * @description Save all roles in database.
 *
 * @returns { Promise<void> }
 *
 * @example
 * $ npm run seed:roles
 */
const main = async () => {
  Logger.info('Start seeding roles in database');

  const rolesList = Object.values(FormationRolesDecisionsTree.definition.roles);

  const promises = processRoles(rolesList);
  await Promise.all(promises.flat(Infinity));

  Logger.info('Successfully seeded roles in database');
};

main();
