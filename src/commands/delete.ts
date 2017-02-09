import { MeshAPI, ProjectNodesNodeUuidGetResponse } from 'mesh-api';
import { State } from '../mesh-cli';

export default async function deleteNode(mesh: MeshAPI, line: string, cmd: string[], state: State): Promise<State> {
    await mesh.api.project(state.project).nodes.nodeUuid(cmd[1]).delete();
    return state;
}
