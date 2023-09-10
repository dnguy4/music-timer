interface YouTubePlaylistRes {
  kind: string;
  etag: string;
  nextPageToken?: string;
  items: {
    kind: string;
    etag: string;
    id: string;
    contentDetails: {
      videoId: string;
      videoPublishedAt: string;
    };
  }[];
}

const YOUTUBE_PL_ITEMS_API =
  "https://www.googleapis.com/youtube/v3/playlistItems";

// https://stackoverflow.com/a/51870158 by tsdorsey
const videoRe =
  /(https?:\/\/)?(((m|www)\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-z-]+)/i;

// https://stackoverflow.com/a/49536318 by sniperd
const playlistRe = /[&?]list=([^&]+)/i;

export const validatePlaylist = async (
  playlist: string,
  video: string
): Promise<[string, string, string]> => {
  const vm = video.match(videoRe);
  const videoId = (vm ? vm[8] : video).trim();

  const pm = playlist.match(playlistRe);
  const playlistId = (pm ? pm[1] : playlist).trim();

  if (playlistId !== "" && videoId !== "") {
    const params = new URLSearchParams({
      part: "contentDetails",
      maxResults: "100",
      playlistId: playlistId,
      key: process.env.REACT_APP_YT_API_KEY as string,
    });

    // Using fetch api, if wasn't using firebase could secure this for real
    const res = await fetch(`${YOUTUBE_PL_ITEMS_API}?${params.toString()}`);
    if (res.ok) {
      const data = (await res.json()) as YouTubePlaylistRes;
      const idx = data.items.findIndex(
        (x) => x.contentDetails.videoId === videoId
      );
      if (idx === -1) {
        return [playlistId, "", "Error: Requested video not in playlist"];
      } else {
        return [playlistId, videoId, ""];
      }
    } else {
      return ["", videoId, "Error: Requested playlist not found"];
    }
  } else {
    return [playlistId, videoId, ""];
  }
};
