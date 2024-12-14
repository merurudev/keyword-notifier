import { Client } from 'discord.js-selfbot-v13';
import consola from 'consola';

import config from '../config.json';

export const client = new Client();

client.on('ready', async (client) => {
	consola.info(`Logged in as ${client.user.username}`);
	// await import('./Notifier')
	import('./onMessage');
});

client.login(config.token);
