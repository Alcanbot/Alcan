import FluorineClient from '@classes/Client';
import { CommandInteraction, ContextMenuInteraction } from 'discord.js';
import { ContextMenuCommandBuilder, SlashCommandBuilder, SlashCommandSubcommandBuilder } from '@discordjs/builders';

export type Category = 'fun' | 'tools' | 'moderation' | 'economy';

export interface ChatInputCommand {
    run: (client: FluorineClient, interaction: CommandInteraction) => void;
    data: SlashCommandBuilder;
    category: Category;
    dev?: boolean;
    cooldown?: number;
}

export interface ChatInputSubcommand {
    run: (client: FluorineClient, interaction: CommandInteraction) => void;
    data: SlashCommandSubcommandBuilder;
    cooldown?: number;
}

export interface ContextMenuCommand {
    run: (client: FluorineClient, interaction: ContextMenuInteraction) => void;
    data: ContextMenuCommandBuilder;
    dev?: boolean;
    cooldown?: number;
}
