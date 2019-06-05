window.onload = function() {
    includeHtml();
}

function includeHtml() {
    const elements = document.getElementsByTagName("*");

    for (const element of elements) {
        const htmlAttribute = element.getAttribute("include-html");

        if (htmlAttribute) {
            const xHttp = new XMLHttpRequest();

            xHttp.onreadystatechange = function() {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        element.innerHTML = this.responseText;
                    } else {
                        element.innerHTML = "Element not found";
                    }

                    element.removeAttribute("include-html");
                    includeHtml();
                }
            }

            xHttp.open("GET", htmlAttribute, true);
            xHttp.send();
            
            return;
        }
    }
}