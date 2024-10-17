/**
 * @file Seed default formation decision tree actions in database.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 *
 * @category Binary
 */

/** @typedef { import('$src/Models/Action').default } Action */

import fs from 'fs';
import Dotenv from 'dotenv';
import $RefParser from '@apidevtools/json-schema-ref-parser';

Dotenv.config();

// TODO: Refactor to static class

/**
 * @function saveAction
 * @description Save action to database and create sub-action model instance if needed.
 *
 * @param   { object<string> }   settings                      - The action to store in database.
 * @param   { object<string> }   settings.action               - The action to store in database.
 * @param   { number }           [settings.parentAnswerId]     - Id of parent answer for when action
 *                                                             is due when answer selected.
 * @param   { number }           [settings.parentPromptFileId] - Id of parent PromptFile action
 *                                                             for when action is due when file
 *                                                             is uploaded.
 * @param   { $RefParser.$Refs } settings.json                 - Decisions tree used to resolve
 *                                                             JSON refs.
 *
 * @returns { Promise<boolean> }                               - The created action.
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
 * saveAction({action, parentAnswerId, parentPromptFileId: null, json: {}});
 */
const saveAction = async ({
  action,
  parentAnswerId = null,
  parentPromptFileId = null,
  json,
}) => {
  const models = (await import('$src/Models')).default;
  const {
    DecisionsTree,
    Action,
    ActionAddRole,
    ActionRemoveRole,
    ActionGoto,
    ActionPrintMessage,
    ActionPromptFile,
    ActionPromptFileHasAction,
    ActionQuestion,
    ActionQuestionAnswer,
    ActionQuestionAnswersHasAction,
    MimeType,
    Role,
  } = models;
  const decisionsTree = await DecisionsTree.findOne({
    where: { name: 'FormationRoles' },
  });

  if (action.$ref !== undefined) {
    // eslint-disable-next-line no-param-reassign
    action = json.get(action.$ref);
  }

  switch (action.type) {
    case 'addRole': {
      if (action.role.$ref !== undefined) {
        // eslint-disable-next-line no-param-reassign
        action.role = json.get(action.role.$ref);
      }
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

        await ActionQuestionAnswersHasAction.create({
          ActionQuestionAnswerId: actionQuestionAnswer.id,
          ActionId: addRole.ActionId,
        });
      }

      if (parentPromptFileId !== null) {
        const actionPromptFile = await ActionPromptFile.findOne({
          where: { id: parentPromptFileId },
        });

        await ActionPromptFileHasAction.create({
          ActionPromptFileId: actionPromptFile.id,
          ActionId: addRole.ActionId,
        });
      }

      break;
    }
    case 'removeRole': {
      if (action.role.$ref !== undefined) {
        // eslint-disable-next-line no-param-reassign
        action.role = json.get(action.role.$ref);
      }
      // TODO: findOrCreate
      const role = await Role.findOne({
        where: { discordId: action.role.roleId },
      });

      const [removeRole, created] = await ActionRemoveRole.findOrCreate({
        where: {
          RoleId: role.id,
        },
      });

      if (created) {
        const createdAction = await Action.create({
          type: action.type,
          DecisionsTreeId: decisionsTree.id,
        });

        removeRole.ActionId = createdAction.id;
        await removeRole.save();
      }

      if (parentAnswerId !== null) {
        const actionQuestionAnswer = await ActionQuestionAnswer.findOne({
          where: { id: parentAnswerId },
        });

        await ActionQuestionAnswersHasAction.create({
          ActionQuestionAnswerId: actionQuestionAnswer.id,
          ActionId: removeRole.ActionId,
        });
      }

      if (parentPromptFileId !== null) {
        const actionPromptFile = await ActionPromptFile.findOne({
          where: { id: parentPromptFileId },
        });

        await ActionPromptFileHasAction.create({
          ActionPromptFileId: actionPromptFile.id,
          ActionId: removeRole.ActionId,
        });
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

        await ActionPromptFileHasAction.create({
          ActionPromptFileId: actionPromptFile.id,
          ActionId: goto.ActionId,
        });
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

        await ActionQuestionAnswersHasAction.create({
          ActionQuestionAnswerId: actionQuestionAnswer.id,
          ActionId: printMessage.ActionId,
        });
      }

      if (parentPromptFileId !== null) {
        const actionPromptFile = await ActionPromptFile.findOne({
          where: { id: parentPromptFileId },
        });

        await ActionPromptFileHasAction.create({
          ActionPromptFileId: actionPromptFile.id,
          ActionId: printMessage.ActionId,
        });
      }
      break;
    }
    case 'promptFile': {
      const promptFile = await ActionPromptFile.create({
        errorMessage: action.errorMessage,
        pendingMessage: action.pendingMessage,
        approvedMessage: action.approvedMessage,
        rejectedMessage: action.rejectedMessage,
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

        await ActionQuestionAnswersHasAction.create({
          ActionQuestionAnswerId: actionQuestionAnswer.id,
          ActionId: promptFile.ActionId,
        });
      }

      if (parentPromptFileId !== null) {
        const actionPromptFile = await ActionPromptFile.findOne({
          where: { id: parentPromptFileId },
        });

        await ActionPromptFileHasAction.create({
          ActionPromptFileId: actionPromptFile.id,
          ActionId: promptFile.ActionId,
        });
      }
      // eslint-disable-next-line no-restricted-syntax
      for (const childActionIdentifier in action.actions) {
        if ({}.hasOwnProperty.call(action.actions, childActionIdentifier)) {
          const childAction = action.actions[childActionIdentifier];
          // eslint-disable-next-line no-await-in-loop
          await saveAction({
            action: childAction,
            parentAnswerId: null,
            parentPromptFileId: promptFile.id,
            json,
          });
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
              let childAction = answer.actions[childActionIdentifier];

              if (childAction.$ref !== undefined) {
                childAction = json.get(childAction.$ref);
              }
              // eslint-disable-next-line no-await-in-loop
              await saveAction({
                action: childAction,
                parentAnswerId: createdAnswer.id,
                parentPromptFileId: null,
                json,
              });
            }
          }
        }
      }

      if (parentAnswerId !== null) {
        const actionQuestionAnswer = await ActionQuestionAnswer.findOne({
          where: { id: parentAnswerId },
        });

        await ActionQuestionAnswersHasAction.create({
          ActionQuestionAnswerId: actionQuestionAnswer.id,
          ActionId: question.ActionId,
        });
      }

      if (parentPromptFileId !== null) {
        const actionPromptFile = await ActionPromptFile.findOne({
          where: { id: parentPromptFileId },
        });

        await ActionPromptFileHasAction.create({
          ActionPromptFileId: actionPromptFile.id,
          ActionId: question.ActionId,
        });
      }
      break;
    }
    case 'removeAllRoles':
    case 'applyRoles':
    case 'getOutOfPipe': {
      const [createdAction] = await Action.findOrCreate({
        where: {
          type: action.type,
          DecisionsTreeId: decisionsTree.id,
        },
      });

      if (parentAnswerId !== null) {
        const actionQuestionAnswer = await ActionQuestionAnswer.findOne({
          where: { id: parentAnswerId },
        });

        await ActionQuestionAnswersHasAction.create({
          ActionQuestionAnswerId: actionQuestionAnswer.id,
          ActionId: createdAction.id,
        });
      }

      if (parentPromptFileId !== null) {
        const actionPromptFile = await ActionPromptFile.findOne({
          where: { id: parentPromptFileId },
        });

        await ActionPromptFileHasAction.create({
          ActionPromptFileId: actionPromptFile.id,
          ActionId: createdAction.id,
        });
      }
      break;
    }
    default:
      break;
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

  const decisionsTree = fs
    .readFileSync('./src/Db/DecisionsTrees/FormationRolesDecisionsTree.json')
    .toString();
  const $refs = await $RefParser.resolve(
    './src/Db/DecisionsTrees/FormationRolesDecisionsTree.json',
  );

  await saveAction({
    action: JSON.parse(decisionsTree).default,
    json: $refs,
  });

  Logger.info('Successfully seeded actions in database');

  return true;
};

await main();
