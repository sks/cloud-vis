export interface TFPlan {
  format_version: string;
  terraform_version: string;
  variables: Variables;
  planned_values: PlannedValues;
  resource_changes?: (ResourceChangesEntity)[] | null;
  configuration: Configuration;
}
export interface Variables {
  aws_amis: AwsAmis;
  aws_region: AwsRegionOrKeyNameOrPublicKeyPath;
  key_name: AwsRegionOrKeyNameOrPublicKeyPath;
  public_key_path: AwsRegionOrKeyNameOrPublicKeyPath;
}
export interface AwsAmis {
  value: Record<string, string>;
}

export interface AwsRegionOrKeyNameOrPublicKeyPath {
  value: string;
}
export interface PlannedValues {
  root_module: RootModule;
}
export interface RootModule {
  resources?: (ResourcesEntity)[] | null;
}
export interface ResourcesEntity {
  address: string;
  mode: string;
  type: string;
  name: string;
  provider_name: string;
  schema_version: number;
  values: ValuesOrAfter;
}
export interface ValuesOrAfter {
  access_logs?: (null)[] | null;
  connection_draining?: boolean | null;
  connection_draining_timeout?: number | null;
  cross_zone_load_balancing?: boolean | null;
  idle_timeout?: number | null;
  listener?: (ListenerEntity)[] | null;
  name?: string | null;
  name_prefix?: null;
  tags?: null;
  ami?: string | null;
  credit_specification?: (null)[] | null;
  disable_api_termination?: null;
  ebs_optimized?: null;
  get_password_data?: boolean | null;
  iam_instance_profile?: null;
  instance_initiated_shutdown_behavior?: null;
  instance_type?: string | null;
  monitoring?: null;
  source_dest_check?: boolean | null;
  timeouts?: null;
  user_data?: null;
  user_data_base64?: null;
  key_name?: string | null;
  key_name_prefix?: null;
  public_key?: string | null;
  destination_cidr_block?: string | null;
  destination_ipv6_cidr_block?: null;
  transit_gateway_id?: null;
  vpc_peering_connection_id?: null;
  description?: string | null;
  egress?: (EgressEntityOrIngressEntity)[] | null;
  ingress?: (EgressEntityOrIngressEntity)[] | null;
  revoke_rules_on_delete?: boolean | null;
  assign_ipv6_address_on_creation?: boolean | null;
  cidr_block?: string | null;
  map_public_ip_on_launch?: boolean | null;
  assign_generated_ipv6_cidr_block?: boolean | null;
  enable_dns_support?: boolean | null;
  instance_tenancy?: string | null;
}
export interface ListenerEntity {
  instance_port: number;
  instance_protocol: string;
  lb_port: number;
  lb_protocol: string;
  ssl_certificate_id: string;
}
export interface EgressEntityOrIngressEntity {
  cidr_blocks?: (string)[] | null;
  description: string;
  from_port: number;
  ipv6_cidr_blocks?: (null)[] | null;
  prefix_list_ids?: (null)[] | null;
  protocol: string;
  security_groups?: (null)[] | null;
  self: boolean;
  to_port: number;
}
export interface ResourceChangesEntity {
  address: string;
  mode: string;
  type: string;
  name: string;
  provider_name: string;
  change: Change;
}
export interface Change {
  actions?: (string)[] | null;
  before?: null;
  after: ValuesOrAfter;
  after_unknown: AfterUnknown;
}
export interface AfterUnknown {
  access_logs?: (null)[] | null;
  arn?: boolean | null;
  availability_zones?: boolean | null;
  dns_name?: boolean | null;
  health_check?: boolean | null;
  id: boolean;
  instances?: boolean | null;
  internal?: boolean | null;
  listener?: (ListenerEntity1)[] | null;
  security_groups?: boolean | null;
  source_security_group?: boolean | null;
  source_security_group_id?: boolean | null;
  subnets?: boolean | null;
  zone_id?: boolean | null;
  associate_public_ip_address?: boolean | null;
  availability_zone?: boolean | null;
  cpu_core_count?: boolean | null;
  cpu_threads_per_core?: boolean | null;
  credit_specification?: (null)[] | null;
  ebs_block_device?: boolean | null;
  ephemeral_block_device?: boolean | null;
  host_id?: boolean | null;
  instance_state?: boolean | null;
  ipv6_address_count?: boolean | null;
  ipv6_addresses?: boolean | null;
  key_name?: boolean | null;
  network_interface?: boolean | null;
  network_interface_id?: boolean | null;
  password_data?: boolean | null;
  placement_group?: boolean | null;
  primary_network_interface_id?: boolean | null;
  private_dns?: boolean | null;
  private_ip?: boolean | null;
  public_dns?: boolean | null;
  public_ip?: boolean | null;
  root_block_device?: boolean | null;
  subnet_id?: boolean | null;
  tenancy?: boolean | null;
  volume_tags?: boolean | null;
  vpc_security_group_ids?: boolean | null;
  owner_id?: boolean | null;
  vpc_id?: boolean | null;
  fingerprint?: boolean | null;
  destination_prefix_list_id?: boolean | null;
  egress_only_gateway_id?: boolean | null;
  gateway_id?: boolean | null;
  instance_id?: boolean | null;
  instance_owner_id?: boolean | null;
  nat_gateway_id?: boolean | null;
  origin?: boolean | null;
  route_table_id?: boolean | null;
  state?: boolean | null;
  egress?: (EgressEntityOrIngressEntity1)[] | null;
  ingress?: (EgressEntityOrIngressEntity1)[] | null;
  availability_zone_id?: boolean | null;
  ipv6_cidr_block?: boolean | null;
  ipv6_cidr_block_association_id?: boolean | null;
  default_network_acl_id?: boolean | null;
  default_route_table_id?: boolean | null;
  default_security_group_id?: boolean | null;
  dhcp_options_id?: boolean | null;
  enable_classiclink?: boolean | null;
  enable_classiclink_dns_support?: boolean | null;
  enable_dns_hostnames?: boolean | null;
  ipv6_association_id?: boolean | null;
  main_route_table_id?: boolean | null;
}
export interface ListenerEntity1 {
}
export interface EgressEntityOrIngressEntity1 {
  cidr_blocks?: (boolean)[] | null;
  ipv6_cidr_blocks?: (null)[] | null;
  prefix_list_ids?: (null)[] | null;
  security_groups?: (null)[] | null;
}
export interface Configuration {
  provider_config: ProviderConfig;
  root_module: RootModule1;
}
export interface ProviderConfig {
  aws: Aws;
}
export interface Aws {
  name: string;
  expressions: Expressions;
}
export interface Expressions {
  region: RegionOrInstancesOrSecurityGroupsOrSubnetsOrAmiOrKeyNameOrSubnetIdOrVpcSecurityGroupIdsOrVpcIdOrPublicKeyOrGatewayIdOrRouteTableId;
}
export interface RegionOrInstancesOrSecurityGroupsOrSubnetsOrAmiOrKeyNameOrSubnetIdOrVpcSecurityGroupIdsOrVpcIdOrPublicKeyOrGatewayIdOrRouteTableId {
  references?: (string)[] | null;
}
export interface RootModule1 {
  resources?: (ResourcesEntity1)[] | null;
  variables: Variables1;
}
export interface ResourcesEntity1 {
  address: string;
  mode: string;
  type: string;
  name: string;
  provider_config_key: string;
  expressions: Expressions1;
  schema_version: number;
  provisioners?: (ProvisionersEntity)[] | null;
}
export interface Expressions1 {
  instances?: RegionOrInstancesOrSecurityGroupsOrSubnetsOrAmiOrKeyNameOrSubnetIdOrVpcSecurityGroupIdsOrVpcIdOrPublicKeyOrGatewayIdOrRouteTableId1 | null;
  listener?: (ListenerEntity2)[] | null;
  name?: InstanceProtocolOrLbProtocolOrNameOrInstanceTypeOrDestinationCidrBlockOrDescriptionOrCidrBlock | null;
  security_groups?: RegionOrInstancesOrSecurityGroupsOrSubnetsOrAmiOrKeyNameOrSubnetIdOrVpcSecurityGroupIdsOrVpcIdOrPublicKeyOrGatewayIdOrRouteTableId2 | null;
  subnets?: RegionOrInstancesOrSecurityGroupsOrSubnetsOrAmiOrKeyNameOrSubnetIdOrVpcSecurityGroupIdsOrVpcIdOrPublicKeyOrGatewayIdOrRouteTableId3 | null;
  ami?: RegionOrInstancesOrSecurityGroupsOrSubnetsOrAmiOrKeyNameOrSubnetIdOrVpcSecurityGroupIdsOrVpcIdOrPublicKeyOrGatewayIdOrRouteTableId4 | null;
  instance_type?: InstanceProtocolOrLbProtocolOrNameOrInstanceTypeOrDestinationCidrBlockOrDescriptionOrCidrBlock1 | null;
  key_name?: RegionOrInstancesOrSecurityGroupsOrSubnetsOrAmiOrKeyNameOrSubnetIdOrVpcSecurityGroupIdsOrVpcIdOrPublicKeyOrGatewayIdOrRouteTableId5 | null;
  subnet_id?: RegionOrInstancesOrSecurityGroupsOrSubnetsOrAmiOrKeyNameOrSubnetIdOrVpcSecurityGroupIdsOrVpcIdOrPublicKeyOrGatewayIdOrRouteTableId6 | null;
  vpc_security_group_ids?: RegionOrInstancesOrSecurityGroupsOrSubnetsOrAmiOrKeyNameOrSubnetIdOrVpcSecurityGroupIdsOrVpcIdOrPublicKeyOrGatewayIdOrRouteTableId7 | null;
  vpc_id?: RegionOrInstancesOrSecurityGroupsOrSubnetsOrAmiOrKeyNameOrSubnetIdOrVpcSecurityGroupIdsOrVpcIdOrPublicKeyOrGatewayIdOrRouteTableId8 | null;
  public_key?: RegionOrInstancesOrSecurityGroupsOrSubnetsOrAmiOrKeyNameOrSubnetIdOrVpcSecurityGroupIdsOrVpcIdOrPublicKeyOrGatewayIdOrRouteTableId9 | null;
  destination_cidr_block?: InstanceProtocolOrLbProtocolOrNameOrInstanceTypeOrDestinationCidrBlockOrDescriptionOrCidrBlock2 | null;
  gateway_id?: RegionOrInstancesOrSecurityGroupsOrSubnetsOrAmiOrKeyNameOrSubnetIdOrVpcSecurityGroupIdsOrVpcIdOrPublicKeyOrGatewayIdOrRouteTableId10 | null;
  route_table_id?: RegionOrInstancesOrSecurityGroupsOrSubnetsOrAmiOrKeyNameOrSubnetIdOrVpcSecurityGroupIdsOrVpcIdOrPublicKeyOrGatewayIdOrRouteTableId11 | null;
  description?: InstanceProtocolOrLbProtocolOrNameOrInstanceTypeOrDestinationCidrBlockOrDescriptionOrCidrBlock3 | null;
  cidr_block?: InstanceProtocolOrLbProtocolOrNameOrInstanceTypeOrDestinationCidrBlockOrDescriptionOrCidrBlock4 | null;
  map_public_ip_on_launch?: MapPublicIpOnLaunch | null;
}
export interface RegionOrInstancesOrSecurityGroupsOrSubnetsOrAmiOrKeyNameOrSubnetIdOrVpcSecurityGroupIdsOrVpcIdOrPublicKeyOrGatewayIdOrRouteTableId1 {
  references?: (string)[] | null;
}
export interface ListenerEntity2 {
  instance_port: InstancePortOrLbPort;
  instance_protocol: InstanceProtocolOrLbProtocolOrNameOrInstanceTypeOrDestinationCidrBlockOrDescriptionOrCidrBlock5;
  lb_port: InstancePortOrLbPort;
  lb_protocol: InstanceProtocolOrLbProtocolOrNameOrInstanceTypeOrDestinationCidrBlockOrDescriptionOrCidrBlock5;
}
export interface InstancePortOrLbPort {
  constant_value: number;
}
export interface InstanceProtocolOrLbProtocolOrNameOrInstanceTypeOrDestinationCidrBlockOrDescriptionOrCidrBlock5 {
  constant_value: string;
}
export interface InstanceProtocolOrLbProtocolOrNameOrInstanceTypeOrDestinationCidrBlockOrDescriptionOrCidrBlock {
  constant_value: string;
}
export interface RegionOrInstancesOrSecurityGroupsOrSubnetsOrAmiOrKeyNameOrSubnetIdOrVpcSecurityGroupIdsOrVpcIdOrPublicKeyOrGatewayIdOrRouteTableId2 {
  references?: (string)[] | null;
}
export interface RegionOrInstancesOrSecurityGroupsOrSubnetsOrAmiOrKeyNameOrSubnetIdOrVpcSecurityGroupIdsOrVpcIdOrPublicKeyOrGatewayIdOrRouteTableId3 {
  references?: (string)[] | null;
}
export interface RegionOrInstancesOrSecurityGroupsOrSubnetsOrAmiOrKeyNameOrSubnetIdOrVpcSecurityGroupIdsOrVpcIdOrPublicKeyOrGatewayIdOrRouteTableId4 {
  references?: (string)[] | null;
}
export interface InstanceProtocolOrLbProtocolOrNameOrInstanceTypeOrDestinationCidrBlockOrDescriptionOrCidrBlock1 {
  constant_value: string;
}
export interface RegionOrInstancesOrSecurityGroupsOrSubnetsOrAmiOrKeyNameOrSubnetIdOrVpcSecurityGroupIdsOrVpcIdOrPublicKeyOrGatewayIdOrRouteTableId5 {
  references?: (string)[] | null;
}
export interface RegionOrInstancesOrSecurityGroupsOrSubnetsOrAmiOrKeyNameOrSubnetIdOrVpcSecurityGroupIdsOrVpcIdOrPublicKeyOrGatewayIdOrRouteTableId6 {
  references?: (string)[] | null;
}
export interface RegionOrInstancesOrSecurityGroupsOrSubnetsOrAmiOrKeyNameOrSubnetIdOrVpcSecurityGroupIdsOrVpcIdOrPublicKeyOrGatewayIdOrRouteTableId7 {
  references?: (string)[] | null;
}
export interface RegionOrInstancesOrSecurityGroupsOrSubnetsOrAmiOrKeyNameOrSubnetIdOrVpcSecurityGroupIdsOrVpcIdOrPublicKeyOrGatewayIdOrRouteTableId8 {
  references?: (string)[] | null;
}
export interface RegionOrInstancesOrSecurityGroupsOrSubnetsOrAmiOrKeyNameOrSubnetIdOrVpcSecurityGroupIdsOrVpcIdOrPublicKeyOrGatewayIdOrRouteTableId9 {
  references?: (string)[] | null;
}
export interface InstanceProtocolOrLbProtocolOrNameOrInstanceTypeOrDestinationCidrBlockOrDescriptionOrCidrBlock2 {
  constant_value: string;
}
export interface RegionOrInstancesOrSecurityGroupsOrSubnetsOrAmiOrKeyNameOrSubnetIdOrVpcSecurityGroupIdsOrVpcIdOrPublicKeyOrGatewayIdOrRouteTableId10 {
  references?: (string)[] | null;
}
export interface RegionOrInstancesOrSecurityGroupsOrSubnetsOrAmiOrKeyNameOrSubnetIdOrVpcSecurityGroupIdsOrVpcIdOrPublicKeyOrGatewayIdOrRouteTableId11 {
  references?: (string)[] | null;
}
export interface InstanceProtocolOrLbProtocolOrNameOrInstanceTypeOrDestinationCidrBlockOrDescriptionOrCidrBlock3 {
  constant_value: string;
}
export interface InstanceProtocolOrLbProtocolOrNameOrInstanceTypeOrDestinationCidrBlockOrDescriptionOrCidrBlock4 {
  constant_value: string;
}
export interface MapPublicIpOnLaunch {
  constant_value: boolean;
}
export interface ProvisionersEntity {
  type: string;
  expressions: Expressions2;
}
export interface Expressions2 {
  inline: Inline;
}
export interface Inline {
  constant_value?: (string)[] | null;
}
export interface Variables1 {
  aws_amis: AwsAmis1;
  aws_region: AwsRegionOrKeyNameOrPublicKeyPath1;
  key_name: AwsRegionOrKeyNameOrPublicKeyPath1;
  public_key_path: AwsRegionOrKeyNameOrPublicKeyPath1;
}
export interface AwsAmis1 {
  default: Record<string, string>;
}
export interface AwsRegionOrKeyNameOrPublicKeyPath1 {
  default: string;
  description: string;
}
