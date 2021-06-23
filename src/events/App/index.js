import EventBus from '$src/EventBus';

import sendWelcomeMessage from './sendWelcomeMessage';

EventBus.on('sendWelcomeMessage', sendWelcomeMessage);

export default { sendWelcomeMessage };
