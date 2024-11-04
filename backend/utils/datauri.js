import Dataparser from "datauri/parser.js"
import path from "path"

const parser = new Dataparser()

const dataUri = (file)=>{
    const extname = path.extname(file.originalname).toString()
    return parser.format(extname, file.buffer).content
}

export default dataUri