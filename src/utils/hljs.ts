import hljs from "highlight.js/lib/core"
import json from "highlight.js/lib/languages/json"
import shell from "highlight.js/lib/languages/shell"
import yaml from "highlight.js/lib/languages/yaml"
import python from "highlight.js/lib/languages/python"

hljs.registerLanguage("json", json)

hljs.registerLanguage("shell", shell)

hljs.registerLanguage("yaml", yaml)

hljs.registerLanguage("python", python)

export default hljs
