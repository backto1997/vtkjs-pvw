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
    // Get viewId from server
    getViewId: () => session.call('viewport.image.push.observer.add', ['-1']),

    // Reset camera to fit the model
    resetCamera: (viewId: string) => session.call('viewport.camera.reset', [viewId]),

    // test: () => session.call('pipeline', []),
    test: () => session.call('show', ['1714445949']),
  }
}
