/**
 * [Custom Protocol Methods]
 *
 * functionName: (...args) => session.call('method.name', [...args]),
 *
 * Example:
 * createSlice: () => session.call('vtk.slice', ['x', 1]),
 */

export default function createMethods(session: any) {
  return {
    resize: (size: number[]) => session.call('viewport.image.push.original.size', ['-1', ...size]),

    createView: () => session.call('create_new_rv', []),
    changeView: () => session.call('change', []),
    loadState: () => session.call('load_state', []),

    test: (viewId: string) => session.call('viewport.camera.get', [viewId]),
  }
}
