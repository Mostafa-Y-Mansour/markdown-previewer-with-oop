import LocalStorageHandler from "./modules/local-storage-handler.js"
import DocsDetailsHandler from "./modules/docs-details-handler.js"

const tabBtns = document.querySelectorAll(".tab-btn")
const markdownTextarea = document.querySelector(".markdown-textarea")

class MarkdownPreviewer {
    static init() {
        markdownTextarea.value = LocalStorageHandler.getData()
        MarkdownPreviewer.displayCompiledHtml()
        DocsDetailsHandler.displayData()

        tabBtns.forEach(btn => {
            btn.addEventListener("click", throttle(() => MarkdownPreviewer.handleTabNavigation(btn)))
        })

        markdownTextarea.addEventListener("keyup", debounce(() => {
            MarkdownPreviewer.displayCompiledHtml()
            LocalStorageHandler.setData(markdownTextarea.value)
        }))
    }

    static handleTabNavigation(currentBtn) {
        const tabContainers = document.querySelectorAll(".tab-container")
        const currentContainer = document.querySelector(`.${currentBtn.dataset.tab}-tab-container`)
        tabContainers.forEach(container => {
            container.classList.remove("active")
        })
        currentContainer.classList.add("active")

        tabBtns.forEach(btn => {
            btn.classList.remove("active")
        })
        currentBtn.classList.add("active")
    }

    static displayCompiledHtml() {
        const previewTabContainer = document.querySelector(".preview-tab-container")
        let htmlToBeRendered = ""
        if (markdownTextarea.value.trim().length === 0) {
            htmlToBeRendered = marked.parse("Nothing to be rendered, try typing something in the Markdown tab.")
        } else {
            htmlToBeRendered = marked.parse(markdownTextarea.value)
        }
        previewTabContainer.innerHTML = htmlToBeRendered
    }
}

MarkdownPreviewer.init()


// throttle is used to limit the number of click on the same btn (default is 1/second)
function throttle(cb, delay = 1000) {
    let lastTime = 0;
    return (...args) => {
        const now = Date.now();
        if (now - lastTime < delay) return;
        lastTime = now;
        cb(...args)
    }
}


// debounce is used to render after the user is done writing in text area (default is 1second)
function debounce(cb, delay = 1000) {
    let timeOut = null;
    return (...args) => {
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
        cb(...args);
    }, delay);
    }
}


// a button to save the content of the text area to the link to be easy to share with others

let saveBTN = document.querySelector(".save-btn")

saveBTN.addEventListener( "click",() => {
    const markdownTextarea = document.querySelector(".markdown-textarea")

    setContentParam("content", markdownTextarea.value)
})

function setContentParam(key, value) {
    let urlPrams = new URLSearchParams(window.location.search)
    urlPrams.set(key, value)
    window.location.search = urlPrams
}

window.addEventListener("load", () => {
    let urlPrams = new URLSearchParams(window.location.search)
    if (window.location.search == null) return;
    const markdownTextarea = document.querySelector(".markdown-textarea")
    markdownTextarea.value = urlPrams.get("content")
})