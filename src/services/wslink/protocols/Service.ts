export default function createMethods(session: any) {
  return {
    // will return viewId from server
    getViewId: () => session.call('viewport.image.push.observer.add', ['-1']),

    // [Custom Protocol Methods]
    // methods are not actually defined and implement on server side
    // just examples of custom protocol methods
    hello: () => session.call('hello.world', ['-1']),
    createVisualization: () => session.call('vtk.initialize', []),
    resetCamera: () => session.call('vtk.camera.reset', []),
  }
}
