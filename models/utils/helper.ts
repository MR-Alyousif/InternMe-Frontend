// don't wanna document it, find its usage or ask me lol.
// NOTE: you gotta `.save()` after this function.
function autoSetFields(model: any, obj: object, omittedKey: string = '') {
  recursiveMap(obj, omittedKey, (path, v) => {
    model.set(path, v)
  })
}

function recursiveMap(
  obj: object,
  path: string,
  func: (path: string, v: any) => void // path: k1.k2.k3
) {
  for (const [k, v] of Object.entries(obj)) {
    const newPath = path.length === 0 ? k : `${path}.${k}`
    if (typeof v === 'object' && v.length === undefined) {
      recursiveMap(v, newPath, func)
    } else {
      func(newPath, v)
    }
  }
}

export { autoSetFields }
