import { SupportLanguage } from 'prettier'

export const languages = [
  {
    name: 'Shell',
    type: 'programming',
    parsers: ['sh'],
    tmScope: 'source.shell',
    aceMode: 'sh',
    codemirrorMode: 'shell',
    codemirrorMimeType: 'text/x-sh',
    aliases: ['sh', 'shell-script', 'bash', 'zsh'],
    extensions: ['.sh', '.zsh'],
    filenames: [
      '.bash_aliases',
      '.bash_history',
      '.bash_logout',
      '.bash_profile',
      '.bashrc',
      '.cshrc',
      '.login',
      '.profile',
      '.zlogin',
      '.zlogout',
      '.zprofile',
      '.zshenv',
      '.zshrc',
      '9fs',
      'GBUILD',
      'sh_aliases',
      'bash_logout',
      'bash_profile',
      'bashrc',
      'cshrc',
      'gradlew',
      'login',
      'man',
      'profile',
      'zlogin',
      'zlogout',
      'zprofile',
      'zshenv',
      'zshrc',
    ],
    linguistLanguageId: 346,
    vscodeLanguageIds: ['shellscript'],
  },
  {
    name: 'Dockerfile',
    type: 'programming',
    parsers: ['sh'],
    tmScope: 'source.dockerfile',
    extensions: ['.dockerfile'],
    filenames: ['Dockerfile'],
    aceMode: 'dockerfile',
    codemirrorMode: 'dockerfile',
    codemirrorMimeType: 'text/x-dockerfile',
    linguistLanguageId: 89,
    vscodeLanguageIds: ['dockerfile'],
  },
  {
    name: 'JVMOptions',
    type: 'data',
    parser: ['sh'],
    extensions: ['.vmoptions'],
    filenames: ['jvm.options'],
    vscodeLanguageIds: ['jvmoptions'],
  },
  {
    name: 'EditorConfig',
    type: 'data',
    parsers: ['sh'],
    group: 'INI',
    filenames: ['.editorconfig'],
    aliases: ['editor-config'],
    aceMode: 'ini',
    codemirrorMode: 'properties',
    codemirrorMimeType: 'text/x-properties',
    tmScope: 'source.editorconfig',
    languageId: 96139566,
    vscodeLanguageIds: ['properties'],
  },
  {
    name: 'Ignore List',
    type: 'data',
    parsers: ['sh'],
    group: 'INI',
    aliases: ['ignore', 'gitignore', 'git-ignore'],
    extensions: ['.gitignore'],
    filenames: [
      '.atomignore',
      '.babelignore',
      '.bzrignore',
      '.coffeelintignore',
      '.cvsignore',
      '.dockerignore',
      '.eslintignore',
      '.gitignore',
      '.nodemonignore',
      '.npmignore',
      '.prettierignore',
      '.stylelintignore',
      '.vscodeignore',
      'gitignore-global',
      'gitignore_global',
    ],
    aceMode: 'gitignore',
    tmScope: 'source.gitignore',
    codemirrorMode: 'shell',
    codemirrorMimeType: 'text/x-sh',
    languageId: 74444240,
    vscodeLanguageIds: ['gitignore'],
  },
  {
    name: 'Git Attributes',
    type: 'data',
    group: 'INI',
    parsers: ['sh'],
    aliases: ['gitattributes'],
    filenames: ['.gitattributes'],
    tmScope: 'source.gitattributes',
    aceMode: 'gitignore',
    codemirrorMode: 'shell',
    codemirrorMimeType: 'text/x-sh',
    language_id: 956324166,
    vscodeLanguageIds: ['ini'],
  },
  {
    name: 'Git Config',
    type: 'data',
    group: 'INI',
    parsers: ['sh'],
    aliases: ['gitconfig', 'gitmodules'],
    extensions: ['.gitconfig'],
    filenames: ['.gitconfig', '.gitmodules'],
    aceMode: 'ini',
    codemirrorMode: 'properties',
    codemirrorMimeType: 'text/x-properties',
    tmScope: 'source.gitconfig',
    languageId: 807968997,
    vscodeLanguageIds: ['properties'],
  },
  {
    name: 'INI',
    type: 'data',
    parsers: ['sh'],
    extensions: [
      '.ini',
      '.cfg',
      '.lektorproject',
      '.prefs',
      '.pro',
      '.properties',
    ],
    filenames: ['buildozer.spec'],
    tmScope: 'source.ini',
    aliases: ['dosini'],
    aceMode: 'ini',
    codemirrorMode: 'properties',
    codemirrorMimeType: 'text/x-properties',
    languageId: 163,
    vscodeLanguageIds: ['ini'],
  },
  {
    name: 'Java Properties',
    type: 'data',
    parsers: ['sh'],
    extensions: ['.properties'],
    tmScope: 'source.java-properties',
    aceMode: 'properties',
    codemirrorMode: 'properties',
    codemirrorMimeType: 'text/x-properties',
    languageId: 519377561,
    vscodeLanguageIds: ['properties'],
  },
  {
    name: 'Windows Registry Entries',
    type: 'data',
    parsers: ['sh'],
    extensions: ['.reg'],
    tmScope: 'source.reg',
    aceMode: 'ini',
    codemirrorMode: 'properties',
    codemirrorMimeType: 'text/x-properties',
    languageId: 969674868,
    vscodeLanguageIds: ['properties'],
  },
  {
    name: 'SSH Config',
    type: 'data',
    group: 'INI',
    parsers: ['sh'],
    filenames: [
      'ssh-config',
      'ssh_config',
      'sshconfig',
      'sshconfig.snip',
      'sshd-config',
      'sshd_config',
    ],
    aceMode: 'text',
    tmScope: 'source.ssh-config',
    languageId: 554920715,
    vscodeLanguageIds: ['properties'],
  },
  {
    name: 'nanorc',
    type: 'data',
    group: 'INI',
    parsers: ['sh'],
    extensions: ['.nanorc'],
    filenames: ['.nanorc', 'nanorc'],
    tmScope: 'source.nanorc',
    aceMode: 'text',
    languageId: 775996197,
    vscodeLanguageIds: ['properties'],
  },
  {
    name: 'hosts',
    // @ts-ignore
    type: 'data',
    parser: ['sh'],
    filenames: ['hosts'],
    vscodeLanguageIds: ['hosts'],
  },
] as SupportLanguage[]
