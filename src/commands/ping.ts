import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    const embed = new Embed(client, interaction.locale)
        .setTitle('Ping')
        .addLocaleField({ name: 'PING', value: `${client.ws.ping}ms` });
    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription("Check the bot's ping");

export const help = {
    name: 'ping',
    description: 'Opóźnienie pomiędzy discordem a botem',
    aliases: ['opoznienie', 'pong'],
    category: 'tools'
};
