import type { RequiredOptions, SupportOption } from 'prettier'

import type { PrettierTaploOptions } from './types'

/**
 * @see https://github.com/tamasfe/taplo/blob/848722f2c604de68535e5a3e0bb2a2c1d3c7dc74/crates/taplo/src/formatter/mod.rs#L150-L168
 */
export const options = {
  taploAlignEntries: {
    name: 'taploAlignEntries',
    type: 'boolean',
    category: 'taplo',
    default: false,
    description: 'Align consecutive entries vertically.',
  },
  taploAlignComments: {
    name: 'taploAlignComments',
    type: 'boolean',
    category: 'taplo',
    default: true,
    description:
      'Align consecutive comments after entries and items vertically. This applies to comments that are after entries or array items.',
  },
  taploArrayAutoExpand: {
    name: 'taploArrayAutoExpand',
    type: 'boolean',
    category: 'taplo',
    default: true,
    description:
      'Expand arrays to multiple lines that exceed the maximum column width.',
  },
  taploArrayAutoCollapse: {
    name: 'taploArrayAutoCollapse',
    type: 'boolean',
    category: 'taplo',
    default: true,
    description:
      "Collapse arrays that don't exceed the maximum column width and don't contain comments.",
  },
  taploCompactArrays: {
    name: 'taploCompactArrays',
    type: 'boolean',
    category: 'taplo',
    default: true,
    description: 'Omit white space padding from single-line arrays.',
  },
  taploCompactInlineTables: {
    name: 'taploCompactInlineTables',
    type: 'boolean',
    category: 'taplo',
    default: false,
    description:
      'Omit white space padding from the start and end of inline tables.',
  },
  taploCompactEntries: {
    name: 'taploCompactEntries',
    type: 'boolean',
    category: 'taplo',
    default: false,
    description: 'Omit white space around `=`.',
  },
  taploIndentTables: {
    name: 'taploIndentTables',
    type: 'boolean',
    category: 'taplo',
    default: false,
    description:
      'Indent based on tables and arrays of tables and their subtables, subtables out of order are not indented.',
  },
  taploIndentEntries: {
    name: 'taploIndentEntries',
    type: 'boolean',
    category: 'taplo',
    default: false,
    description: 'Indent entries under tables.',
  },
  taploReorderKeys: {
    name: 'taploReorderKeys',
    type: 'boolean',
    category: 'taplo',
    default: false,
    description:
      'Alphabetically reorder keys that are not separated by empty lines.',
  },
} satisfies Record<keyof PrettierTaploOptions, SupportOption>

export const defaultOptions: Partial<RequiredOptions> &
  Required<PrettierTaploOptions> = {
  taploAlignEntries: options.taploAlignComments.default,
  taploAlignComments: options.taploAlignComments.default,
  taploArrayAutoExpand: options.taploArrayAutoExpand.default,
  taploArrayAutoCollapse: options.taploArrayAutoCollapse.default,
  taploCompactArrays: options.taploCompactArrays.default,
  taploCompactInlineTables: options.taploCompactInlineTables.default,
  taploCompactEntries: options.taploCompactEntries.default,
  taploIndentTables: options.taploIndentTables.default,
  taploIndentEntries: options.taploIndentEntries.default,
  taploReorderKeys: options.taploReorderKeys.default,
}
