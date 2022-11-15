/**
 * @file Seed default formation decision tree actions in database.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @category Binary
 */

/** @typedef { import('$src/Models/Action').default } Action */

import childProcess from 'child_process';
import fs from 'fs';
import Dotenv from 'dotenv';

Dotenv.config();

// TODO: Refactor to static class

/**
 * @function execute
 * @description Execute a given command, used to compile formation decisionsTree.
 *
 * @param   { string }          command - Command to execute.
 *
 * @returns { Promise<object> }         - Command result.
 *
 * @example
 * const result = await execute('ls -la ./');
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
 * @function saveAction
 * @description Save action to database and create sub-action model instance if needed.
 *
 * @param   { object }          action           - The action to store in database.
 * @param   { number }          [parentAnswerId] - Id of parent answer for when action
 *                                               is due when answer selected.
 *
 * @returns { Promise<Action> }                  - The created action.
 *
 * @example
 * const action = {
 *   type: "question",
 *   question: "Hello 👋 This is a question",
 *   answers: [
 *     {
 *       icon: "✅",
 *       text: "Answer A",
 *       actions: {
 *         "6978174d-3683-4954-bc62-3c28f1c8d302": {
 *           type: "printMessage",
 *           message: "Nice !",
 *         },
 *       }
 *     },
 *     {
 *       icon: "❌",
 *       text: "Answer B",
 *       actions: {
 *         "e90bae0a-be8e-4e7b-9e18-8ad6e8e37470": {
 *           type: "addRole",
 *           role: {
 *            name: "my super role",
 *            roleId: "667286314802216962",
 *           }
 *         },
 *         "6978174d-3683-4954-bc62-3c28f1c8d303": {
 *           type: "printMessage",
 *           message: "Nice !",
 *         },
 *       },
 *     },
 *   ],
 * };
 * const parentAnswerId = 15;
 *
 * saveAction(action, parentAnswerId);
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
            await saveAction(childAction, createdAnswer.id);
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
 * @function main
 * @description It loads the JSON file, resolves all the json references,
 * and then save the action in database.
 *
 * @returns { Promise<boolean | void> } - Undefined if an error occurred or
 *                                      true if actions were seeded successfully.
 *
 * @example
 * $ npm run seed:actions
 */
const main = async () => {
  const Logger = (await import('$src/Logger')).default;

  Logger.info('Start seeding actions in database');

  if (!fs.existsSync(process.argv[2]))
    return Logger.error(true, 'Cannot load Decisions Tree json file');

  const decisionsTree = await execute(`json-refs resolve ${process.argv[2]}`);
  await saveAction(decisionsTree.default);

  Logger.info('Successfully seeded actions in database');

  return true;
};

main();
