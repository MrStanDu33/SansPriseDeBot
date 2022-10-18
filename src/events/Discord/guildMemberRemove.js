/**
 * @file Handle "user left" event from discord by removing member from pipe.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import Logger from '$src/Logger/index';
import Store from '$src/Store';
import models from '$src/Models';

const { LinkedChannel, FollowedMember } = models;

export default async (member) => {
  if (process.env.DRY_RUN === 'true') return;
  /*
   * TODO: Detect on boot diff between channels on db and users on server.
   * if so => delete channel and record !
   */
  const { client } = Store;

  Logger.info(`A member just left ! (${member.user.tag})`);
  const loader = Logger.loader(
    { spinner: 'dots10', color: 'cyan' },
    `Deleting welcome channel for ${member.user.tag}`,
    'info',
  );

  const followedMember = await FollowedMember.findOne({
    where: { memberId: member.user.id },
    include: [LinkedChannel],
  });

  const channel = client.channels.cache.get(
    followedMember.LinkedChannel.discordId,
  );

  await channel
    .delete()
    .then(() => {
      loader.succeed();
      Logger.info(
        `Channel ${followedMember.LinkedChannel.name} successfully deleted !`,
      );
    })
    .then(() => followedMember.delete())
    .catch((error) => {
      loader.fail();
      Logger.error(
        ` An error has occurred while deleting welcome channel for ${member.user.tag}!`,
        true,
      );
      throw new Error(error);
    });
};
