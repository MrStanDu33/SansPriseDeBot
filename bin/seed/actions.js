/**
 * @file Seed default formation decision tree actions in database.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

/**
 * @module Seed:actions
 *
 * @category Binaries
 *
 * @subcategory Seed
 */

/** @typedef { import('$src/Models/Action').default } Action */

import childProcess from 'child_process';
import fs from 'fs';
import Dotenv from 'dotenv';

Dotenv.config();

/**
 * @description Execute a given command, used to compile formation decisionsTree.
 *
 * @param   { string }          command - Command to execute.
 *
 * @returns { Promise<object> }         - Command result.
 */
const execute = (command) =>
  new Promise((resolve, reject) => {
    childProcess.exec(command, (error, standardOutput, standardError) => {
      if (error) return reject();
      if (standardError) return reject(standardError);
      return resolve(standardOutput);
    });
  });

/**
 * @description It saves the action to the database and returns true.
 *
 * @param   { object }           action           - The action to store in the database.
 * @param   { number | null }    [parentAnswerId] - Id of parent answer for when action
 *                                                is due when answer selected.
 *
 * @returns { Promise<boolean> }                  - Return true when action done.
 */
const processAction = async (action, parentAnswerId = null) => {
  // eslint-disable-next-line no-use-before-define
  await saveAction(action, parentAnswerId);
  return true;
};

/**
 * @description Save action to database and create sub-action model instance if needed.
 *
 * @param   { object }          action           - The action to store in database.
 * @param   { number }          [parentAnswerId] - Id of parent answer for when action
 *                                               is due when answer selected.
 *
 * @returns { Promise<Action> }                  - The created action.
 */
const saveAction = async (action, parentAnswerId = null) => {
  const models = (await import('$src/Models')).default;
  const {
    DecisionsTree,
    Action,
    ActionAddRole,
    ActionGoto,
    ActionPrintMessage,
    ActionQuestion,
    ActionQuestionAnswer,
    Role,
  } = models;

  const decisionsTree = await DecisionsTree.findOne({
    where: { name: 'FormationRoles' },
  });

  const createdAction = await Action.create({
    DecisionsTreeId: decisionsTree.id,
    type: action.type,
    ActionQuestionAnswerId: parentAnswerId,
  });

  switch (action.type) {
    case 'addRole': {
      const role = await Role.findOne({
        where: { discordId: action.role.roleId },
      });

      await ActionAddRole.create({
        ActionId: createdAction.id,
        RoleId: role.id,
      });
      break;
    }
    case 'GOTO': {
      await ActionGoto.create({
        ActionId: createdAction.id,
        TargetActionId: 1,
      });
      break;
    }
    case 'printMessage': {
      await ActionPrintMessage.create({
        ActionId: createdAction.id,
        message: action.message,
      });
      break;
    }
    case 'question': {
      const createdQuestion = await ActionQuestion.create({
        ActionId: createdAction.id,
        question: action.question,
      });

      // eslint-disable-next-line no-restricted-syntax
      for (const answer of action.answers) {
        // eslint-disable-next-line no-await-in-loop
        const createdAnswer = await ActionQuestionAnswer.create({
          ActionQuestionId: createdQuestion.id,
          icon: answer.icon,
          text: answer.text,
        });
        // eslint-disable-next-line no-restricted-syntax
        for (const childActionIdentifier in answer.actions) {
          if ({}.hasOwnProperty.call(answer.actions, childActionIdentifier)) {
            const childAction = answer.actions[childActionIdentifier];
            // eslint-disable-next-line no-await-in-loop
            await processAction(childAction, createdAnswer.id);
          }
        }
      }
      break;
    }
    default: {
      break;
    }
  }

  return createdAction;
};

/**
 * @description It loads the JSON file, resolves all the json references,
 * and then save the action in database.
 *
 * @returns { Promise<boolean | void> } - Undefined if an error occurred or
 *                                      true if actions were seeded successfully.
 */
const main = async () => {
  const Logger = (await import('$src/Logger')).default;

  Logger.info('Start seeding actions in database');

  if (!fs.existsSync(process.argv[2]))
    return Logger.error(true, 'Cannot load Decisions Tree json file');

  const decisionsTree = await execute(`json-refs resolve ${process.argv[2]}`);
  await processAction(decisionsTree.default);

  Logger.info('Successfully seeded actions in database');

  return true;
};

main();
