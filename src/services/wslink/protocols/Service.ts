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
    addObserver: () => session.call('viewport.image.push.observer.add', ['-1']),
    resize: (viewId: string, size: number[]) =>
      session.call('viewport.image.push.original.size', [viewId, ...size]),

    loadCarotid: () => session.call('load_carotid', []),
    loadFem: () => session.call('load_fem', []),
    loadState: () => session.call('load_state', []),

    test: (viewId: string) => session.call('viewport.camera.get', [viewId]),
  }
}
