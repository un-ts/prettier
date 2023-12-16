/// <reference path="../shim.d.ts" />

import { JSOX } from 'jsox'
import type { AST, Option } from 'node-sql-parser'
import nodeSqlParser from 'node-sql-parser'
import type { Options, ParserOptions, Plugin } from 'prettier'
import {
  DialectOptions,
  format,
  formatDialect,
  type FormatOptions,
  type FormatOptionsWithLanguage,
} from 'sql-formatter'

import { languages } from './languages.js'

const parser = new nodeSqlParser.Parser()

const SQL_FORMATTER = 'sql-formatter'
const NODE_SQL_PARSER = 'node-sql-parser'
const SQL_CST = 'sql-cst'

const ENDINGS = {
  lf: '\n',
  cr: '\r',
  crlf: '\r\n',
} as const

export type SqlBaseOptions = Option &
  Partial<
    | (FormatOptions & { dialect: string })
    | (FormatOptionsWithLanguage & { dialect?: never })
  > & {
    formatter?: typeof NODE_SQL_PARSER | typeof SQL_CST | typeof SQL_FORMATTER
    params?: string
    paramTypes?: string
  }

export type SqlOptions = ParserOptions<AST> & SqlBaseOptions

export type SqlFormatOptions = Options & SqlBaseOptions

const SqlPlugin: Plugin<AST | string> = {
  languages,
  parsers: {
    sql: {
      parse(text, { formatter, type, database }: SqlOptions) {
        return formatter === SQL_FORMATTER
          ? text
          : (parser.astify(text, { type, database }) as AST)
      },
      astFormat: 'sql',
      locStart: () => -1,
      locEnd: () => -1,
    },
  },
  printers: {
    sql: {
      print(
        path,
        {
          type,
          database,
          dialect,
          endOfLine,
          params,
          paramTypes,
          ...options
        }: SqlOptions,
      ) {
        const value = path.node

        let formatted: string

        // eslint-disable-next-line unicorn/no-negated-condition -- Keep first block short
        if (typeof value !== 'string') {
          formatted = parser.sqlify(value, { type, database })
        } else {
          const sqlFormatterOptions = {
            ...options,
            params:
              params == null
                ? undefined
                : (JSOX.parse(params) as FormatOptionsWithLanguage['params']),
            paramTypes:
              paramTypes == null
                ? undefined
                : (JSOX.parse(
                    paramTypes,
                  ) as FormatOptionsWithLanguage['paramTypes']),
          }

          formatted =
            dialect == null
              ? format(value, sqlFormatterOptions)
              : formatDialect(value, {
                  ...sqlFormatterOptions,
                  dialect: JSOX.parse(dialect) as DialectOptions,
                })
        }

        // It can never be `auto`
        // @see https://github.com/prettier/prettier/blob/ab72a2c11c806f3a8a5ef42314e291843e1b3e68/src/common/end-of-line.js#L3-L9
        const ending = ENDINGS[endOfLine as keyof typeof ENDINGS]

        formatted = formatted.replaceAll(/\r\n?|\n/g, ending)

        return formatted.endsWith(ending) ? formatted : formatted + ending
      },
    },
  },
  options: {
    formatter: {
      // since: '0.1.0',
      category: 'Config',
      type: 'choice',
      default: SQL_FORMATTER,
      description: 'Choose which formatter to be used',
      choices: [
        {
          value: SQL_FORMATTER,
          description: 'use `sql-formatter` as formatter',
        },
        {
          value: NODE_SQL_PARSER,
          description: 'use `node-sql-parser` as formatter',
        },
        {
          value: SQL_CST,
          description: 'use `prettier-plugin-sql-cst` under the hood',
        },
      ],
    },
    dialect: {
      // since: '0.18.0',
      category: 'Config',
      type: 'string',
      description: 'SQL dialect for `sql-formatter` formatDialect()',
    },
    language: {
      // since: '0.1.0',
      category: 'Config',
      type: 'choice',
      default: 'sql',
      description: 'SQL dialect for `sql-formatter` format()',
      choices: [
        {
          value: 'sql',
          description: 'Standard SQL: https://en.wikipedia.org/wiki/SQL:2011',
        },
        {
          value: 'bigquery',
          description:
            'Google Standard SQL (Bigquery): https://cloud.google.com/bigquery',
        },
        {
          value: 'db2',
          description: 'IBM DB2: https://www.ibm.com/products/db2',
        },
        {
          value: 'db2i',
          description:
            'IBM DB2i (experimental): https://www.ibm.com/docs/en/i/7.5?topic=overview-db2-i',
        },
        {
          value: 'hive',
          description: 'Apache Hive: https://hive.apache.org',
        },
        {
          value: 'mariadb',
          description: 'MariaDB: https://mariadb.com',
        },
        {
          value: 'mysql',
          description: 'MySQL: https://www.mysql.com',
        },
        {
          value: 'n1ql',
          description:
            'Couchbase N1QL: https://www.couchbase.com/products/n1ql',
        },
        {
          value: 'plsql',
          description:
            'Oracle PL/SQL: https://www.oracle.com/database/technologies/appdev/plsql.html',
        },
        {
          value: 'postgresql',
          description: 'PostgreSQL: https://www.postgresql.org',
        },
        {
          value: 'redshift',
          description:
            'Amazon Redshift: https://docs.aws.amazon.com/redshift/latest/dg/cm_chap_SQLCommandRef.html',
        },
        {
          value: 'singlestoredb',
          description:
            'SingleStoreDB: https://docs.singlestore.com/db/v7.8/en/introduction/singlestore-documentation.html',
        },
        {
          value: 'snowflake',
          description: 'Snowflake: https://docs.snowflake.com',
        },
        {
          value: 'spark',
          description: 'Spark: https://spark.apache.org',
        },
        {
          value: 'sqlite',
          description: 'SQLite: https://www.sqlite.org',
        },
        {
          value: 'transactsql',
          description:
            'SQL Server Transact-SQL: https://docs.microsoft.com/en-us/sql/sql-server/',
        },
        {
          value: 'tsql',
          description:
            'SQL Server Transact-SQL: https://docs.microsoft.com/en-us/sql/sql-server/',
        },
        {
          value: 'trino',
          description: 'Trino: https://trino.io',
        },
      ],
    },
    keywordCase: {
      // since: '0.7.0',
      category: 'Output',
      type: 'choice',
      default: 'preserve',
      description:
        'Converts reserved keywords to upper- or lowercase for `sql-formatter`',
      choices: [
        {
          value: 'preserve',
          description: 'preserves the original case of reserved keywords',
        },
        {
          value: 'upper',
          description: 'converts reserved keywords to uppercase',
        },
        {
          value: 'lower',
          description: 'converts reserved keywords to lowercase',
        },
      ],
    },
    dataTypeCase: {
      // since: '0.18.0',
      category: 'Output',
      type: 'choice',
      default: 'preserve',
      description:
        'Converts data types to upper- or lowercase for `sql-formatter`',
      choices: [
        {
          value: 'preserve',
          description: 'preserves the original case of data types',
        },
        {
          value: 'upper',
          description: 'converts data types to uppercase',
        },
        {
          value: 'lower',
          description: 'converts data types to lowercase',
        },
      ],
    },
    functionCase: {
      // since: '0.18.0',
      category: 'Output',
      type: 'choice',
      default: 'preserve',
      description:
        'Converts functions to upper- or lowercase for `sql-formatter`',
      choices: [
        {
          value: 'preserve',
          description: 'preserves the original case of functions',
        },
        {
          value: 'upper',
          description: 'converts functions to uppercase',
        },
        {
          value: 'lower',
          description: 'converts functions to lowercase',
        },
      ],
    },
    identifierCase: {
      // since: '0.17.0',
      category: 'Output',
      type: 'choice',
      default: 'preserve',
      description:
        'Converts identifiers to upper- or lowercase for `sql-formatter`. Only unquoted identifiers are converted. (experimental)',
      choices: [
        {
          value: 'preserve',
          description: 'preserves the original case of identifiers',
        },
        {
          value: 'upper',
          description: 'converts identifiers to uppercase',
        },
        {
          value: 'lower',
          description: 'converts identifiers to lowercase',
        },
      ],
    },
    uppercase: {
      // since: '0.1.0',
      category: 'Output',
      type: 'boolean',
      deprecated: '0.7.0',
      description: 'Use `keywordCase` option instead',
    },
    indentStyle: {
      // since: '0.7.0',
      category: 'Format',
      type: 'choice',
      default: 'standard',
      description: `Switches between different indentation styles for \`sql-formatter\`.

      Caveats of using \`"tabularLeft"\` and \`"tabularRight"\`:

      - \`tabWidth\` option is ignored. Indentation will always be 10 spaces, regardless of what is specified by \`tabWidth\``,
      choices: [
        {
          value: 'standard',
          description:
            'indents code by the amount specified by `tabWidth` option',
        },
        {
          value: 'tabularLeft',
          description:
            'indents in tabular style with 10 spaces, aligning keywords to left',
        },
        {
          value: 'tabularRight',
          description:
            'indents in tabular style with 10 spaces, aligning keywords to right',
        },
      ],
    },
    logicalOperatorNewline: {
      // since: '0.7.0',
      category: 'Format',
      type: 'choice',
      default: 'before',
      description:
        'Decides newline placement before or after logical operators (AND, OR, XOR)',
      choices: [
        {
          value: 'before',
          description: 'adds newline before the operator',
        },
        {
          value: 'after',
          description: 'adds newline after the operator',
        },
      ],
    },
    expressionWidth: {
      // since: '0.7.0',
      category: 'Format',
      type: 'int',
      default: 50,
      description:
        'Determines maximum length of parenthesized expressions for `sql-formatter`',
    },
    linesBetweenQueries: {
      // since: '0.1.0',
      category: 'Format',
      type: 'int',
      default: 1,
      description:
        'Decides how many empty lines to leave between SQL statements for `sql-formatter`',
    },
    denseOperators: {
      // since: '0.7.0',
      category: 'Format',
      type: 'boolean',
      default: false,
      description:
        'Decides whitespace around operators for `sql-formatter`. Does not apply to logical operators (AND, OR, XOR).',
    },
    newlineBeforeSemicolon: {
      // since: '0.7.0',
      category: 'Format',
      type: 'boolean',
      default: false,
      description:
        'Whether to place query separator (`;`) on a separate line for `sql-formatter`',
    },
    params: {
      // since: '0.7.0',
      category: 'Format',
      type: 'string',
      description:
        'Specifies `JSOX` **stringified** parameter values to fill in for placeholders inside SQL for `sql-formatter`. This option is designed to be used through API (though nothing really prevents usage from command line).',
    },
    paramTypes: {
      // since: '0.11.0',
      category: 'Config',
      type: 'string',
      description:
        'Specifies `JSOX` **stringified** parameter types to support when parsing SQL prepared statements for `sql-formatter`.',
    },
    type: {
      // since: '0.1.0',
      category: 'Config',
      type: 'choice',
      default: 'table',
      description: 'Check the SQL with Authority List for `node-sql-parser`',
      choices: [
        {
          value: 'table',
          description: '`table` mode',
        },
        {
          value: 'column',
          description: '`column` mode',
        },
      ],
    },
    database: {
      // since: '0.1.0',
      category: 'Config',
      type: 'choice',
      default: 'mysql',
      description: 'SQL dialect for `node-sql-parser`',
      choices: [
        {
          value: 'bigquery',
          description: 'BigQuery: https://cloud.google.com/bigquery',
        },
        {
          value: 'db2',
          description: 'IBM DB2: https://www.ibm.com/analytics/db2',
        },
        {
          value: 'hive',
          description: 'Hive: https://hive.apache.org',
        },
        {
          value: 'mariadb',
          description: 'MariaDB: https://mariadb.com',
        },
        {
          value: 'mysql',
          description: 'MySQL: https://www.mysql.com',
        },
        {
          value: 'postgresql',
          description: 'PostgreSQL: https://www.postgresql.org',
        },
        {
          value: 'transactsql',
          description:
            'TransactSQL: https://docs.microsoft.com/en-us/sql/t-sql',
        },
        {
          value: 'flinksql',
          description:
            'FlinkSQL: https://ci.apache.org/projects/flink/flink-docs-stable',
        },
        {
          value: 'snowflake',
          description: 'Snowflake (alpha): https://docs.snowflake.com',
        },
      ],
    },
  },
}

export default SqlPlugin
