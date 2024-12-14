import { DMChannel, GroupDMChannel, Message, NewsChannel, StageChannel, TextChannel, ThreadChannel, VoiceChannel } from 'discord.js-selfbot-v13';

export function getMsgInfo(msg: Message<boolean>) {
	const channel = msg.channel;
	if (channel instanceof DMChannel) {
		return {
			name: channel.recipient.username,
			isGuild: false,
			isDM: true,
		};
	} else if (channel instanceof GroupDMChannel) {
		return {
			name: channel.name,
			isGuild: false,
			isDM: true,
		};
	} else if (channel instanceof NewsChannel || channel instanceof TextChannel || channel instanceof ThreadChannel || channel instanceof VoiceChannel || channel instanceof StageChannel) {
		return {
			name: channel.name,
			isGuild: true,
			guild: {
				name: channel.guild.name,
			},
			isDM: false,
		};
	} else {
		throw new Error('getChannelInfo did an oopsie');
	}
}
