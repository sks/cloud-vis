import {TFPlan} from './tfplan';
import {CloudHeirarchy} from './cloud_heirarchy';
import {SVG, off} from '@svgdotjs/svg.js';

async function getTerraformPlanFile(): Promise<TFPlan> {
  const resp = await fetch('/tfplan.json');
  return resp.json();
}

const subnetHeight = 200,
  totalWidth = 1000,
  offset = subnetHeight * .1,
  icons = {
    aws_vpc: '/icons/Networking & Content Delivery/Amazon-VPC.svg',
  };

async function  main() {
  const tfPlan = await getTerraformPlanFile();
  const heirarcy = new CloudHeirarchy(tfPlan);

  heirarcy.vpcs.forEach((v, i) => {
    console.log(`vpc ${v} has ${heirarcy.resourceCount(v)} resources`);
    const subnets = heirarcy.subnets(v);
    const draw = SVG()
      .size(totalWidth, (subnets.length + 2) * subnetHeight).addTo('body');
    draw.use('Icon_Test', icons.aws_vpc)
        .move(i , i * subnetHeight);
    subnets.forEach((s, si) => {
      draw.rect(totalWidth, subnetHeight).attr({
        fill: 'none',
        stroke: '#646464',
      }).move(0, si * subnetHeight);
      draw.text(s).move(offset , (si * subnetHeight) + .4 * subnetHeight);
      heirarcy.awsInstances(s).forEach((a, ai) => {
        draw.text(a).move((ai + 1) * subnetHeight + offset , (si * subnetHeight) + offset);
        draw.rect(subnetHeight * .8, .8 * subnetHeight).attr({
          fill: 'none',
          stroke: '#646464',
        }).move((ai + 1) * subnetHeight, (si * subnetHeight) + offset);
      });
    });
  });
}

main();