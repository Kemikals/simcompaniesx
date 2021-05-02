function tryAtInterval(callback, interval, limit) {
    let timesRun = 0;
    const repeater = setInterval(() => {
        if (callback() || (limit && ++timesRun > limit)) {
            clearInterval(repeater)
        }
    }, interval)
}

function removeAllElements(...elements) {
    elements.forEach((button) => {
        if (button) {
            button.remove()
        }
    })
}