import { AST, Option, Parser } from 'node-sql-parser'
import { Options, ParserOptions, Plugin } from 'prettier'
import { FormatOptions, format } from 'sql-formatter'

const parser = new Parser()

const SQL_FORMATTER = 'sql-formatter'
const NODE_SQL_PARSER = 'node-sql-parser'

export type SqlBaseOptions = Omit<FormatOptions, 'indent'> &
  Option & {
    formatter?: typeof NODE_SQL_PARSER | typeof SQL_FORMATTER
  }

export type SqlOptions = ParserOptions<AST> & SqlBaseOptions

export type SqlFormatOptions = Options & SqlBaseOptions

const SqlPlugin: Plugin<AST | string> = {
  parsers: {
    sql: {
      parse(text, _parsers, { formatter, type, database }: SqlOptions) {
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
          useTabs,
          tabWidth,
          language,
          uppercase,
          linesBetweenQueries,
          type,
          database,
        }: SqlOptions,
      ) {
        const value = path.getValue()
        return typeof value === 'string'
          ? format(value, {
              language,
              uppercase,
              linesBetweenQueries,
              indent: useTabs ? '\b' : ' '.repeat(tabWidth),
            })
          : parser.sqlify(value, { type, database })
      },
    },
  },
  options: {
    formatter: {
      since: '0.1.0',
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
      since: '0.1.0',
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
          value: 'spark',
          description: 'Spark: https://spark.apache.org',
        },
        {
          value: 'tsql',
          description:
            'SQL Server Transact-SQL: https://docs.microsoft.com/en-us/sql/sql-server/',
        },
      ],
    },
    uppercase: {
      since: '0.1.0',
      category: 'Output',
      type: 'boolean',
      default: false,
      description:
        'Capitalize language keywords for `sql-formatter`, not safe to use when SQL dialect has case-sensitive identifiers',
    },
    linesBetweenQueries: {
      since: '0.1.0',
      category: 'Format',
      type: 'int',
      default: 2,
      description:
        'How many newlines to insert between queries (separated by ";") for `sql-formatter`',
    },
    type: {
      since: '0.1.0',
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
      since: '0.1.0',
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
