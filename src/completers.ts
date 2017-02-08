import { State } from './index';
import { MeshAPI } from 'mesh-api-client';
import defaultCompleter from './completers/default';
import nodeChildrenCompleter from './completers/nodechildren';

type Completer = (mesh: MeshAPI, line: string, cmd: string[], state: State) => Promise<[string[], string]>;
interface CompleterTable { [key: string]: Completer }
export const COMPLETERS: CompleterTable = {
    defaultCompleter: defaultCompleter,
    cd: nodeChildrenCompleter((node, cmd) => {
        return node.container && (node.uuid.indexOf(cmd[1]) === 0 || node.fields.name.indexOf(cmd[1]) === 0);
    }),
    read: nodeChildrenCompleter((node, cmd) => {
        return node.uuid.indexOf(cmd[1]) === 0;
    })
}
