export default function createMethods(session: any) {
  return {
    // methods are not actually defined on server side, just examples of custom protocol methods
    updateResolution: (resolution: number) =>
      session.call('vtk.cone.resolution.update', [resolution]),
  }
}
