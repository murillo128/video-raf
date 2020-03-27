const canvas	= document.querySelector("canvas");
const offscreen = canvas.transferControlToOffscreen ();
const video	= document.querySelector("#local");
const worker	= new Worker ("worker.js");


//Send offsscreen canvas to worker
worker.postMessage ({canvas: offscreen}, [offscreen]);

document.querySelector ("button").onclick = async ()=> {
	
	//started
	document.body.children[0].innerHTML = "";

	const cam = await navigator.mediaDevices.getUserMedia({video:true,audio:false});

	video.srcObject = cam;
	video.play();
	
	//Cpature stream from canvas
	const captured = canvas.captureStream();
	const videoTrack = captured.getVideoTracks()[0];
	mirror.srcObject = captured;
	mirror.play();

	let last = 0;
	let count = 0;

	if (!video.requestAnimationFrame)
		video.requestAnimationFrame = (func) => {
			return requestAnimationFrame(()=>{
				func(new Date().getTime(), {
					width   : video.videoWidth,
					height	: video.videoHeight
				})
			});
		}
	
	const display = async (time,metadata)=>{
		if (time-last>1000)
		{
			if (time) console.log(time, count*1000/(time-last));
			last = time;
			count = 0;
		}
		
		if (metadata.width && metadata.height)
		{
			count++;
			createImageBitmap(video, 0, 0,  metadata.width, metadata.height)
				.then(image=>worker.postMessage ({image: image, width: metadata.width, height: metadata.height}, [image]));
		}
		
		video.requestAnimationFrame(display);
	};

	video.requestAnimationFrame(display);
};
