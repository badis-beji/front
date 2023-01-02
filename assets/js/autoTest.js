// import  * as met from "./myScript";
// async function autoTest(){

// await met.sleep(10000)
// met.capture()
// met.downloadCanvasAsImage
// met.clearCanvas
// }

async function capture() {
    try {
        let mediaStream = await navigator.mediaDevices.getDisplayMedia({
            audio: false,
            video: true
        });

        // Grab frame from stream
        let track = mediaStream.getVideoTracks()[0]
        let capture = new ImageCapture(track)
        await sleep(1500)

        // Draw the bitmap to canvas
        let bitmap = await capture.grabFrame()
        canvas.width = bitmap.width
        canvas.height = bitmap.height
        canvas.getContext('2d').drawImage(bitmap, 0, 0)

        // Stop sharing
        track.stop()
        await sleep(500)
        downloadCanvasAsImage()
        // Grab blob from canvas
        canvas.toBlob(blob => {
            blob.name = captureName
            let data = [new ClipboardItem({ [blob.type]: blob })]
            navigator.clipboard.write(data)
        });

    } catch (err) {
        alert("Error: " + err.message)
    }
}
function downloadCanvasAsImage() {
    // Check if the canvas is empty
    /*if (isCanvasBlank(canvas))
        return alert('please take a screenshot');*/

    // Convert image to base 64
    const canvasImage = canvas.toDataURL('image/png')

    let xhr = new XMLHttpRequest()
    xhr.responseType = 'blob';
    xhr.onload = () => {
        let a = document.createElement('a')
        a.href = window.URL.createObjectURL(xhr.response)
        a.download = captureName
        a.style.display = 'none'
        document.body.appendChild(a);
        a.click()
        a.remove()
    }
    xhr.open('GET', canvasImage)
    xhr.send()
}
function clearCanvas(evt) {
    const { canvas, context } = evt.target;
    context.save()
    context.setTransform(1, 0, 0, 1, 0, 0)
    context.clearRect(0, 0, canvas.width, canvas.height)
    canvas.height = 150
    canvas.width = 300
    context.restore()
}
async function auto() {

    capture()
        await sleep(2000)
        downloadCanvasAsImage()
        clearCanvas()
}
setInterval(() => { auto()
    
}, 5000000);