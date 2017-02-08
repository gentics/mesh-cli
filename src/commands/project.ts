import { MeshAPI } from 'mesh-api-client';
import { State } from '../index';

export default async function project(mesh: MeshAPI, cmd: string[], state: State): Promise<State> {
  return new Promise<State>(async (resolve, reject) => {
    let projects = await mesh.api.projects.get();
    let p = projects.data.filter((p) => {
      return p.name === cmd[1];
    });
    if (p.length === 0) {
      reject('No such project.');
    } else {
      let current = await mesh.api.project(p[0].name).nodes.nodeUuid(p[0].rootNodeUuid).get();
      resolve(new State(state.rl, cmd[1], current));
    }
  });
}