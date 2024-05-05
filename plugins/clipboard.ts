export default defineNuxtPlugin(() => {
    return {
        provide: {
            clipboard: {
                copy(text: string) {
                    try {
                        let textarea = document.createElement("textarea")
                        textarea.value = text
                        document.body.appendChild(textarea)
                        textarea.focus()
                        textarea.select()
                        document.execCommand("copy")
                        document.body.removeChild(textarea)
                        return true
                    } catch (e) {
                        return false
                    }
                }
            }
        }
    }
})