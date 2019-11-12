import {TFPlan} from './tfplan';
import {CloudHeirarchy} from './cloud_heirarchy';
async function getTerraformPlanFile(): Promise<TFPlan> {
  const resp = await fetch('/tfplan.json');
  return resp.json();
}


async function  main() {
  const tfPlan = await getTerraformPlanFile();
  const heirarcy = new CloudHeirarchy(tfPlan);
  heirarcy.vpcs.forEach(v => {
    console.log(`vpc ${v} has ${heirarcy.resourceCount(v)} resources`);
  });
}

main();