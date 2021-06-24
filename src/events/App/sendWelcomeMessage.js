import Store from '$src/Store';
import i18n from '$src/I18n';

export default (data) => {
  const { client } = Store;

  const channel = client.channels.cache.get(data.id);

  channel.send(`${i18n.l('WELCOME_MESSAGE', data.linkedMemberId)}`);
};
