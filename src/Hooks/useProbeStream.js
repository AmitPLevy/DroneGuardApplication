import React from "react";
import { RNFFprobe } from "react-native-ffmpeg";
import cloneDeep from "lodash/cloneDeep";
import { streamDeviceDomain } from "../../Assets/consts";
export default function useProbeStream(errorOccurred) {
  const [isProbing, setIsProbing] = React.useState(true);
  const [width, setWidth] = React.useState(960);
  const [height, setHeight] = React.useState(540);
  const [firstVideoStream, setFirstVideoStream] = React.useState({});
  React.useLayoutEffect(() => {
    // const streamURL = `rtmp://${streamDeviceDomain}/live/myVideo`;
    const streamURL = `rtp://10.100.102.12:1234`;
    (async () => {
      setIsProbing(true);
      try {
        console.log("starting probe");
        const streamInfo = await RNFFprobe.getMediaInformation(streamURL);
        const streams = streamInfo.streams;
        for (let i = 0; i < streams.length; i++) {
          if (
            streams[i].hasOwnProperty("type") &&
            streams[i].type === "video"
          ) {
            setFirstVideoStream(cloneDeep(streams[i]));
            if (streams[i].hasOwnProperty("width")) setWidth(streams[i].width);
            if (streams[i].hasOwnProperty("height"))
              setHeight(streams[i].height);
            break;
          }
        }
      } catch (error) {
        console.log("\n\n\n\n\nRNFFmpeg probe error!");
        console.log(error.hasOwnProperty("message") ? error.message : error);
      }
      setIsProbing(false);
    })();
  }, [errorOccurred]);
  return [isProbing, width, height];
}
