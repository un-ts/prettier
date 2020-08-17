// Sortkeys are based on Official Docker Compose Specification
// https://docs.docker.com/compose/compose-file/

// TODO: Implementation these rules to docker compose files which are usually written in YAML, for that there will be used package which parses YAML to JSON and then sort whole package with rules written bellow.

export const primary = [
  'version',
  'services',
  'networks',
  'volumes',
  'configs',
  'secrets',
]

export const servicesBuild = [
  'context',
  'dockerfile',
  'args',
  'cache_from',
  'labels',
  'network',
  'target',
]

export const servicesDeploy = [
  'endpoint_mode',
  'labels',
  'mode',
  'placement',
  'max_replicas_per_node',
  'replicas',
  'resources',
  'restart_policy',
  'rollback_config',
  'update_config',
]

export const servicesNetworks = ['aliases', 'ipv4_address', 'ipv6_address']

export const services = [
  servicesBuild,
  'cap_add',
  'cap_drop',
  'cgroup_parent',
  'command',
  'configs',
  'container_name',
  'credential_spec',
  'depends_on',
  servicesDeploy,
  'devices',
  'dns',
  'dns_search',
  'entrypoint',
  'env_file',
  'environment',
  'expose',
  'external_links',
  'extra_hosts',
  'healthcheck',
  'image',
  'init',
  'isolation',
  'labels',
  'links',
  'logging',
  'network_mode',
  servicesNetworks,
  'pid',
  'ports',
  'restart',
  'secrets',
  'security_opt',
  'stop_grace_preiod',
  'stop_signal',
  'sysctls',
  'tmpfs',
  'ulimits',
  'userns_mode',
  'volumes',
]

export const volumes = ['driver', 'driver_opts', 'external', 'labels', 'name']

export const networks = [
  'driver',
  'driver_opts',
  'attachable',
  'enable_ipv6',
  'ipam',
  'internal',
  'labels',
  'external',
  'name',
]
