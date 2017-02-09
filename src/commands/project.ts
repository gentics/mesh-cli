import { MeshAPI } from 'mesh-api-client';
import { State } from '../mesh-cli';

export default async function project(mesh: MeshAPI, line: string, cmd: string[], state: State): Promise<State> {
  return new Promise<State>(async (resolve, reject) => {
    let projects = await mesh.api.projects.get();
    let p = projects.data.filter((p) => p.name === cmd[1]);
    if (p.length === 0) {
      reject('No such project.');
    } else {
      mesh.api.project(p[0].name).nodes.nodeUuid(p[0].rootNodeUuid).get({ version: 'draft' })
        .then((node) => {
          resolve(new State(state.rl, cmd[1], node));
        })
        .catch((e) => {
          reject(e);
        });
    }
  });
}