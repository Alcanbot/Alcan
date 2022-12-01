import { SlashCommandBuilder } from 'discord.js';
import type { Category } from '#types';

export const slashCommandData = new SlashCommandBuilder()
    .setName('dev')
    .setDescription("Commands intended to ease in Fluorine's development.");

export const category: Category = 'tools';
export const dev = true;