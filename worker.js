let canvas;

onmessage = function(evt) {
    if (evt.data.canvas) {
        canvas = evt.data.canvas;
    } else {
	canvas.width = evt.data.width;
	canvas.height = evt.data.height;
      	const context = canvas.getContext('bitmaprenderer');
	context.transferFromImageBitmap(evt.data.image);
    }
}
