"use client";

import { useEffect, useRef } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

export default function BlogContent({
  html,
  video,
}: {
  html: string;
  video?: string;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Init Plyr for video above the content
    if (playerRef.current && !playerRef.current.classList.contains("plyr-initialized")) {
      const player = playerRef.current;

      player.classList.add("plyr-initialized");
      player.setAttribute("playsinline", "true");
      player.removeAttribute("controls");

      new Plyr(player, {
        controls: [
          "play",
          "play-large",
          "progress",
          "current-time",
          "mute",
          "volume",
          "fullscreen",
        ],
        autoplay: false,
        clickToPlay: true,
      });
    }

    // Init Plyr for videos inside html content
    if (contentRef.current) {
      const embeddedVideos = contentRef.current.querySelectorAll("video");
      embeddedVideos.forEach((videoEl) => {
        if (videoEl.classList.contains("plyr-initialized")) return;

        videoEl.classList.add("plyr-initialized");
        videoEl.setAttribute("playsinline", "true");
        videoEl.removeAttribute("controls");

        new Plyr(videoEl, {
          controls: [
            "play",
            "play-large",
            "progress",
            "current-time",
            "mute",
            "volume",
            "fullscreen",
          ],
          autoplay: false,
          clickToPlay: true,
        });
      });
    }
  }, [html, video]);

  return (
    <div ref={contentRef}>
      {video && video.length > 0 && (
        <div className="mb-4">
          <video
            ref={playerRef}
            src={video}
            className="video-player"
            style={{ width: "100%", overflow: "hidden" }}
            playsInline
          >
            <source src={video} type="video/mp4" />
          </video>
        </div>
      )}

      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
