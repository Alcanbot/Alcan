import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { codeBlock } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { execSync } from 'child_process';
import ApplicationCommandHandler from '@handlers/ApplicationCommandHandler';
import ComponentHandler from '@handlers/ComponentHandler';
import EventHandler from '@handlers/EventHandler';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const type = interaction.options.getString('type');
    const module = interaction.options.getString('module');

    try {
        if (process.env.NODE_ENV === 'development') execSync('npm run build');
        delete require.cache[require.resolve(`./../../${type}/${module}.js`)];

        switch (type) {
            case 'events': {
                if (module === 'all') {
                    client.logger.warn(`All events taken offline.`);
                    client.removeAllListeners();
                    new EventHandler(client);
                    client.logger.log(`All events back online.`);

                    return interaction.editReply('Reloaded all events.');
                }

                const eventFile: any = await import(`./../../events/${module}`);
                const callback = (...event) => {
                    eventFile.run(client, ...event);
                };

                client.logger.warn(`${module} event taken offline.`);
                client.removeAllListeners(module);
                client.on(module, callback);
                client.logger.log(`${module} event back online.`);

                interaction.editReply(`Reloaded the \`${module}\` event.`);
                break;
            }

            case 'commands': {
                if (module === 'all') {
                    const { loadChatInput } = new ApplicationCommandHandler(client);
                    client.applicationCommands.chatInput = loadChatInput();
                    return interaction.editReply('Reloaded `all` chat input commands.');
                }

                const commandFile = await import(`./../../commands/${module}`);
                client.applicationCommands.chatInput.set(module.split('/')[0], commandFile);

                interaction.editReply(`Reloaded the \`${module}\` chat input command.`);
                break;
            }

            case 'context': {
                if (module === 'all') {
                    const { loadContextMenu } = new ApplicationCommandHandler(client);
                    loadContextMenu().then(c => (client.applicationCommands.contextMenu = c));
                    return interaction.editReply('Reloaded `all` context menu commands.');
                }

                const commandFile = await import(`./../../context/${module}`);
                client.applicationCommands.contextMenu.set(module, commandFile);

                interaction.editReply(`Reloaded the \`${module}\` context menu command.`);
                break;
            }

            case 'components': {
                if (module === 'all') {
                    client.components = new ComponentHandler(client).loadComponents();
                    return interaction.editReply('Reloaded `all` components.');
                }

                const commandFile = await import(`./../../components/${module}`);
                client.components.set(module, commandFile);

                interaction.editReply(`Reloaded the \`${module}\` component.`);
                break;
            }
        }
    } catch (error) {
        const embed = new Embed(client, interaction.locale)
            .setTitle('Failed')
            .setDescription(codeBlock('js', error.stack));

        interaction.editReply({ embeds: [embed] });
    }
}