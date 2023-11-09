import type { AST, Option } from 'node-sql-parser'
import nodeSqlParser from 'node-sql-parser'
import type { Options, ParserOptions, Plugin } from 'prettier'
import { format, type FormatOptions } from 'sql-formatter'

import { languages } from './languages.js'

const parser = new nodeSqlParser.Parser()

const SQL_FORMATTER = 'sql-formatter'
const NODE_SQL_PARSER = 'node-sql-parser'

const ENDINGS = {
  lf: '\n',
  cr: '\r',
  crlf: '\r\n',
} as const

export type SqlBaseOptions = Option &
  Partial<FormatOptions> & {
    language?: string
    formatter?: typeof NODE_SQL_PARSER | typeof SQL_FORMATTER
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
      print(path, { type, database, endOfLine, ...options }: SqlOptions) {
        const value = path.node

        let formatted =
          typeof value === 'string'
            ? format(value, options)
            : parser.sqlify(value, { type, database })

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
      ],
    },
    language: {
      // since: '0.1.0',
      category: 'Config',
      type: 'choice',
      default: 'sql',
      description: 'SQL Formatter dialect for `sql-formatter`',
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
          value: 'db2',
          description: 'IBM DB2: https://www.ibm.com/analytics/db2',
        },
        {
          value: 'plsql',
          description:
            'Oracle PL/SQL: https://www.oracle.com/database/technologies/appdev/plsql.html',
        },
        {
          value: 'n1ql',
          description:
            'Couchbase N1QL: https://www.couchbase.com/products/n1ql',
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
          value: 'spark',
          description: 'Spark: https://spark.apache.org',
        },
        {
          value: 'sqlite',
          description: 'SQLite: https://www.sqlite.org/index.html',
        },
        {
          value: 'trino',
          description: 'Trino: https://trino.io',
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
      ],
    },
    keywordCase: {
      // since: '0.7.0',
      category: 'Output',
      type: 'choice',
      default: 'preserve',
      description:
        'Converts reserved keywords and builtin function names to upper or lowercase for `sql-formatter`',
      choices: [
        {
          value: 'preserve',
          description: 'preserves the original case',
        },
        {
          value: 'upper',
          description: 'converts to uppercase',
        },
        {
          value: 'lower',
          description: 'converts to lowercase',
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
    tabulateAlias: {
      // since: '0.7.0',
      category: 'Format',
      type: 'boolean',
      default: false,
      description:
        'Aligns column aliases into a single column  for `sql-formatter`. Does not effect table name aliases.',
    },
    commaPosition: {
      // since: '0.7.0',
      category: 'Format',
      type: 'choice',
      default: 'after',
      description:
        'Defines where to place commas in lists of columns for `sql-formatter`',
      choices: [
        {
          value: 'after',
          description: 'places comma at the end of line',
        },
        {
          value: 'before',
          description: 'places comma at the start of line',
        },
        {
          value: 'tabular',
          description: 'aligns commas in a column at the end of line',
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
      type: 'choice',
      description:
        'Specifies parameter values to fill in for placeholders inside SQL for `sql-formatter`. This option is designed to be used through API (though nothing really prevents usage from command line).',
      choices: [
        {
          value: Array,
          description:
            '`Array` of strings and/or numbers for position placeholders',
        },
        {
          value: Object,
          description:
            '`Object` of name-value pairs for named (and indexed) placeholders',
        },
      ],
      // @ts-expect-error
      exception(value: unknown) {
        return (
          value == null ||
          (Array.isArray(value)
            ? value.every(
                (v: unknown) => typeof v === 'string' || typeof v === 'number',
              )
            : typeof value === 'object')
        )
      },
    },
    paramTypes: {
      // since: '0.11.0',
      category: 'Config',
      type: 'choice',
      description:
        'Specifies parameter types to support when parsing SQL prepared statements for `sql-formatter`.',
      choices: [
        {
          value: Object,
          description:
            'Specifies parameter types to support when parsing SQL prepared statements.',
        },
      ],
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
      ],
    },
  },
}

export default SqlPlugin
