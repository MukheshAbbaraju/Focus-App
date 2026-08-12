import { useEffect, useRef } from 'react'

// Loads the YouTube IFrame API once and reuses it. rel=0, modestbranding
// and no autoplay-into-suggestions keep the player from turning back
// into a feed the moment a video ends.
let apiPromise = null
function loadYoutubeApi() {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT)
  if (apiPromise) return apiPromise

  apiPromise = new Promise((resolve) => {
    const prevReady = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      if (prevReady) prevReady()
      resolve(window.YT)
    }
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
  })
  return apiPromise
}

export default function YouTubePlayer({ videoId, playlistId, onEnded }) {
  const mountRef = useRef(null)
  const playerRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    loadYoutubeApi().then((YT) => {
      if (cancelled || !mountRef.current) return

      const opts = {
        host: 'https://www.youtube-nocookie.com',
        playerVars: {
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          fs: 1,
          iv_load_policy: 3, // hide video annotations
        },
        events: {
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.ENDED && onEnded) onEnded()
          },
        },
      }

      if (playlistId) {
        opts.playerVars.listType = 'playlist'
        opts.playerVars.list = playlistId
      } else {
        opts.videoId = videoId
      }

      playerRef.current = new YT.Player(mountRef.current, opts)
    })

    return () => {
      cancelled = true
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, playlistId])

  return (
    <div className="aspect-video w-full bg-ink overflow-hidden">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  )
}
