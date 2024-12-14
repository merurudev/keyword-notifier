import consola from 'consola';
import { client } from '.';

import config from '../config.json';
import { DataT, SendLog } from './Notifier';
import { getMsgInfo } from './utils/getInfo';
import assert from 'assert';

client.on('messageCreate', async (msg) => {
	if (msg.author.id == config.notify.mentionID) return;
	if (config.keywords.some((word) => msg.content.includes(word))) {
		consola.info(`Detected: ${msg.content}`);

		const info = getMsgInfo(msg);
		if (!info.isGuild) {
			const data = {
				username: msg.author.username,
				id: msg.author.id,
				avatar: msg.author.displayAvatarURL(),
				location: `https://discord.com/channels/@me/${msg.channelId}/${msg.id}`,
				content: msg.content,
				type: 'DM',
				date: msg.author.createdTimestamp,
			} as DataT;
			return SendLog(data);
		}
		assert(msg.guild);

		const data = {
			username: msg.author.username,
			id: msg.author.id,
			avatar: msg.author.displayAvatarURL(),
			location: `https://discord.com/channels/${msg.guild.id}/${msg.channelId}/${msg.id}`,
			content: msg.content,
			type: 'サーバー',
			date: msg.author.createdTimestamp,
		} as DataT;
		return SendLog(data);
	}
});
