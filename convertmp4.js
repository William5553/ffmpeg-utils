const ffmpeg = require('fluent-ffmpeg');

if (process.argv.length < 3) return console.log("input a file nerd");

for (const fileLocation of process.argv.slice(2)) {
    const source = fileLocation.toString().trim();
    const outputName = `${source.split('.').slice(0, -1).join('.')}_converted.mp4`;

    ffmpeg({ source, stdoutLines: 0 })
        .videoCodec('libx264')
        .audioCodec('aac')
        .save(outputName)
        .on('codecData', data => console.log(`Converting ${fileLocation} (${data.duration})`))
        .on('progress', progress => console.log(`Frame ${progress.frames} (${progress.currentFps} fps) | ${progress.timemark} | ${progress.targetSize}kb (${progress.currentKbps} kbps)`))
        .on('end', () => console.log(`Written to ${outputName}`))
        .on('error', err => console.log(`Cannot process video: ${err.message}`));
}

console.log("Press Ctrl+C to exit")
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', key => {
    if (key == '\u0003') process.exit();
});