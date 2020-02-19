const canvas = document.querySelector("canvas");
const video  = document.querySelector("#local");


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
			return setTimeout(()=>{
				func(new Date().getTime(), {
					width   : video.videoWidth,
					height	: video.videoHeight
				})
			},33);
		}
	const display = async (time,metadata)=>{
		if (time-last>1000)
		{
			if (time) console.log(time, count*1000/(time-last));
			last = time;
			count = 0;
		}
		
		video.requestAnimationFrame(display);
		
		if (metadata.width && metadata.height)
		{
			count++;
			canvas.width = metadata.width;
			canvas.height = metadata.height;
			if (true)
			{
				//ImageBitmap
				const image = await createImageBitmap(video, 0, 0,  metadata.width, metadata.height);
				const context = canvas.getContext('bitmaprenderer');
				context.transferFromImageBitmap(image);
			} else {
				//drawImage
				const context = canvas.getContext('2d');
				context.drawImage(video,0,0,metadata.width,metadata.height);
			}
			videoTrack.requestFrame();
		}

		
	};

	video.requestAnimationFrame(display);
};
