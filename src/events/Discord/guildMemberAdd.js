/**
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

import EventBus from '$src/EventBus';
import Logger from '$src/Logger';

export default (member) => {
  if (member.guild.id !== process.env.DISCORD_SERVER_ID) return;

  Logger.info(`New member just came ! (${member.user.tag})`);
  EventBus.emit('App_initializePipe', member);
};
