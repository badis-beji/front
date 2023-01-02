const captureBtn = document.querySelector("#capture")
//const downloadBtn = document.querySelector("#download")
const clearBtn = document.querySelector("#clear")
const closeBtn = document.querySelector(".close")
const canvas = document.querySelector('#canvas')
const context = canvas.getContext("2d")
const frame = canvas.toDataURL("image/png")
const captureName = `screenshot-${new Date().getTime()}`
const a ="C:\\Users\\badis\\Pictures\\api"
let arr = ['errorPicPath', 'aa']
const sleep = time => new Promise(res => setTimeout(res, time, "done sleeping"));

let { innerWidth, innerHeight } = window
// Event Listeners
captureBtn.addEventListener('click', execute)
//downloadBtn.addEventListener('click', downloadCanvasAsImage)
closeBtn.addEventListener('click', function () {
    document.querySelector(".popup").style.display = "none";
});
// Pass additional params to the function
clearBtn.addEventListener('click', clearCanvas)
clearBtn.canvas = canvas
clearBtn.context = context
function formulaire() {
    document.querySelector(".popup").style.display = "flex";
}

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

function execute() {

    capture();
    setTimeout(() => {
        window.location.href="form.html"
    }, (7000));


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

function isCanvasBlank(canvas) {
    return !canvas.getContext('2d')
        .getImageData(0, 0, canvas.width, canvas.height).data
        .some(channel => channel !== 0)
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
// form submission
const form = document.getElementById('form')
form.addEventListener('submit', function (e) {
    // preventing auto submission
    e.preventDefault();
    // post method
    const oldmyData = new FormData(form)
    const myData = new URLSearchParams(oldmyData)

    const object = { errorPicPath: a + "\\" + captureName };
    oldmyData.forEach((value, key) => object[key] = value)

    const json = JSON.stringify(object)
    console.log(object)

    fetch("http://localhost:8080/api/v2/modelClass", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: json,

    })
        .then(res => res.json())
        //.then(data => console.log(data))  
        .catch(err => console.log(err))
})
