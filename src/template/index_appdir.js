const createAppDir = (numberOfDirectoryMoves, privatePath) => {
    let path = `/../${privatePath.split('/').splice(3).join('/')}App/`

    for (let i = 0; i < numberOfDirectoryMoves; i++) {
        path = `/..${path}`
    }

    return path
}

export default createAppDir
