import { TFPlan, ResourcesEntity1 } from './tfplan';

export class CloudHeirarchy {
  constructor(private readonly tfPlan: TFPlan) {}
  public get vpcs(): string[] {
    return this.tfPlan.configuration.root_module.resources
      .filter(r => r.type === 'aws_vpc')
      .map(r => r.address);
  }
  public internetGateways(vpcID: string): string[] {
    return this.instanceInVPC(vpcID, 'aws_internet_gateway');
  }
  public subnets(vpcID: string): string[] {
    return this.instanceInVPC(vpcID, 'aws_subnet');
  }
  public instanceInVPC(vpcID: string, type: string): string[] {
    return this.tfPlan.configuration.root_module.resources
    .filter(r => r.type === type && r.expressions.vpc_id.references.indexOf(vpcID) !== -1)
    .map(r => r.address);
  }
  public routes(vpcID: string): string[] {
    return this.instanceInVPC(vpcID, 'aws_route');
  }
  public securityGroups(vpcID: string): string[] {
    return this.instanceInVPC(vpcID, 'aws_security_group');
  }
  public details(address: string): ResourcesEntity1 {
    return this.tfPlan.configuration.root_module.resources.find(r => r.address === address);
  }
  public awsInstances(subnet: string): string[] {
    return this.tfPlan.configuration.root_module.resources
    .filter(r => r.type === 'aws_instance' && r.expressions.subnet_id.references.indexOf(subnet) !== -1)
    .map(r => r.address);
  }
  public resourceCount(vpcID: string): number {
    let count = this.securityGroups(vpcID).length + this.internetGateways(vpcID).length;
    return this.subnets(vpcID)
      .reduce((t, subnet) => t + 1 + this.awsInstances(subnet).length,
      count);
  }
  public String(): string {
    return `cloud with ${this.vpcs.length} vpcs`;
  }
}