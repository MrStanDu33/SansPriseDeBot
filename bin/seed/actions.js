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
 * @param   { object }           action               - The action to store in database.
 * @param   { number }           [parentAnswerId]     - Id of parent answer for when action
 *                                                    is due when answer selected.
 * @param   { number }           [parentPromptFileId] - Id of parent PromptFile action for
 *                                                    when action is due when file is uploaded.
 *
 * @returns { Promise<boolean> }                      - The created action.
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
 * saveAction(action, parentAnswerId, null);
 */
const saveAction = async (
  action,
  parentAnswerId = null,
  parentPromptFileId = null,
) => {
  const models = (await import('$src/Models')).default;
  const {
    DecisionsTree,
    Action,
    ActionAddRole,
    ActionGoto,
    ActionPrintMessage,
    ActionPromptFile,
    ActionQuestion,
    ActionQuestionAnswer,
    MimeType,
    Role,
  } = models;
  const decisionsTree = await DecisionsTree.findOne({
    where: { name: 'FormationRoles' },
  });

  switch (action.type) {
    case 'addRole': {
      // TODO: findOrCreate
      const role = await Role.findOne({
        where: { discordId: action.role.roleId },
      });

      const [addRole, created] = await ActionAddRole.findOrCreate({
        where: {
          RoleId: role.id,
        },
      });

      if (created) {
        const createdAction = await Action.create({
          type: action.type,
          DecisionsTreeId: decisionsTree.id,
        });

        addRole.ActionId = createdAction.id;
        await addRole.save();
      }

      if (parentAnswerId !== null) {
        const actionQuestionAnswer = await ActionQuestionAnswer.findOne({
          where: { id: parentAnswerId },
        });
        await actionQuestionAnswer.addAction(addRole.ActionId);
      }

      if (parentPromptFileId !== null) {
        const actionPromptFile = await ActionPromptFile.findOne({
          where: { id: parentPromptFileId },
        });
        await actionPromptFile.addAction(addRole.ActionId);
      }

      break;
    }
    case 'GOTO': {
      const [goto, created] = await ActionGoto.findOrCreate({
        where: {
          TargetActionId: 1,
        },
      });

      if (created) {
        const createdAction = await Action.create({
          type: action.type,
          DecisionsTreeId: decisionsTree.id,
        });

        goto.ActionId = createdAction.id;
        await goto.save();
      }

      if (parentAnswerId !== null) {
        const actionQuestionAnswer = await ActionQuestionAnswer.findOne({
          where: { id: parentAnswerId },
        });
        await actionQuestionAnswer.addAction(goto.ActionId);
      }

      if (parentPromptFileId !== null) {
        const actionPromptFile = await ActionPromptFile.findOne({
          where: { id: parentPromptFileId },
        });
        await actionPromptFile.addAction(goto.ActionId);
      }
      break;
    }
    case 'printMessage': {
      const [printMessage, created] = await ActionPrintMessage.findOrCreate({
        where: {
          message: action.message,
        },
      });

      if (created) {
        const createdAction = await Action.create({
          type: action.type,
          DecisionsTreeId: decisionsTree.id,
        });

        printMessage.ActionId = createdAction.id;
        await printMessage.save();
      }

      if (parentAnswerId !== null) {
        const actionQuestionAnswer = await ActionQuestionAnswer.findOne({
          where: { id: parentAnswerId },
        });
        await actionQuestionAnswer.addAction(printMessage.ActionId);
      }

      if (parentPromptFileId !== null) {
        const actionPromptFile = await ActionPromptFile.findOne({
          where: { id: parentPromptFileId },
        });
        await actionPromptFile.addAction(printMessage.ActionId);
      }
      break;
    }
    case 'promptFile': {
      const promptFile = await ActionPromptFile.create({
        errorMessage: action.errorMessage,
      });

      const createdAction = await Action.create({
        type: action.type,
        DecisionsTreeId: decisionsTree.id,
      });

      promptFile.ActionId = createdAction.id;
      await promptFile.save();

      // eslint-disable-next-line no-restricted-syntax
      for (const mimeType of action.allowedMimeTypes) {
        // eslint-disable-next-line no-await-in-loop
        const [createdMimeType] = await MimeType.findOrCreate({
          where: {
            name: mimeType,
          },
        });
        promptFile.addMimeType(createdMimeType);
      }

      if (parentAnswerId !== null) {
        const actionQuestionAnswer = await ActionQuestionAnswer.findOne({
          where: { id: parentAnswerId },
        });
        await actionQuestionAnswer.addAction(promptFile.ActionId);
      }

      if (parentPromptFileId !== null) {
        const actionPromptFile = await ActionPromptFile.findOne({
          where: { id: parentPromptFileId },
        });
        await actionPromptFile.addAction(promptFile.ActionId);
      }
      // eslint-disable-next-line no-restricted-syntax
      for (const childActionIdentifier in action.actions) {
        if ({}.hasOwnProperty.call(action.actions, childActionIdentifier)) {
          const childAction = action.actions[childActionIdentifier];
          // eslint-disable-next-line no-await-in-loop
          await saveAction(childAction, null, promptFile.id);
        }
      }
      break;
    }
    case 'question': {
      const [question, created] = await ActionQuestion.findOrCreate({
        where: {
          uuid: action.uuid,
        },
        defaults: {
          uuid: action.uuid,
          question: action.question,
        },
      });

      if (created) {
        const createdAction = await Action.create({
          type: action.type,
          DecisionsTreeId: decisionsTree.id,
        });

        question.ActionId = createdAction.id;
        await question.save();

        if (parentAnswerId !== null) {
          const actionQuestionAnswer = await ActionQuestionAnswer.findOne({
            where: { id: parentAnswerId },
          });
          await actionQuestionAnswer.addAction(question.ActionId);
          await actionQuestionAnswer.save();
        }

        if (parentPromptFileId !== null) {
          const actionPromptFile = await ActionPromptFile.findOne({
            where: { id: parentPromptFileId },
          });
          await actionPromptFile.addAction(question.ActionId);
        }

        // eslint-disable-next-line no-restricted-syntax
        for (const answer of action.answers) {
          // eslint-disable-next-line no-await-in-loop
          const createdAnswer = await ActionQuestionAnswer.create({
            ActionQuestionId: question.id,
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
      }
      break;
    }
    case 'applyRoles':
    case 'getOutOfPipe': {
      const createdAction = await Action.create({
        type: action.type,
        DecisionsTreeId: decisionsTree.id,
      });

      if (parentAnswerId !== null) {
        const actionQuestionAnswer = await ActionQuestionAnswer.findOne({
          where: { id: parentAnswerId },
        });
        await actionQuestionAnswer.addAction(createdAction.id);
      }

      if (parentPromptFileId !== null) {
        const actionPromptFile = await ActionPromptFile.findOne({
          where: { id: parentPromptFileId },
        });
        await actionPromptFile.addAction(createdAction.id);
      }
      break;
    }
    default: {
      break;
    }
  }
  return true;
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

  const decisionsTree = await execute(
    `json-refs resolve ./src/Db/DecisionsTrees/FormationRolesDecisionsTree.json`,
  );
  await saveAction(JSON.parse(decisionsTree).default);

  Logger.info('Successfully seeded actions in database');

  return true;
};

await main();
