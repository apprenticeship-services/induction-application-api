// import { useState, useRef } from 'react'
// import { toast } from 'sonner'
// // import { AxiosError } from 'axios'

// export const Video = () => {
//   const [isEnded, setIsEnded] = useState<boolean>(false)
//   // const [previousTime, setPreviousTime] = useState(0)
//   // const [currentTime, setCurrentTime] = useState(0)
//   // // const { data, inductionStatus, setInductionStatus } = useInduction()
//   // const data = {
//   //   induction: false
//   // }
//   // const inductionStatus = false

//   // const updateInduction = async () => {
//   //   try {
//   //     // const response = await axios.put('/api/apprentice/induction')
//   //     // if (response.status === 204) {
//   //     //   toast.success('Induction Completed')
//   //     // }
//   //     toast.success('Induction Completed')
//   //   } catch (error) {
//   //     const e = error as AxiosError
//   //     toast.error(e.response?.data as string)
//   //   }
//   // }

//   const handleOnEnd = () => {
//     try {
//       if (!isEnded) {
//         console.log('ended')
//         setIsEnded(true)
//         toast.success('You completed your induction!')
//       }
//     } catch (error) {
//       setIsEnded(false)
//     }
//   }

//   const videoRef = useRef<HTMLVideoElement>(null)
//   // const handleTimeUpdate = () => {
//   //   if (data?.induction) {
//   //     return
//   //   }
//   //   if (!videoRef.current!.seeking) {
//   //     if (videoRef.current!.currentTime > previousTime) {
//   //       setPreviousTime(videoRef.current!.currentTime)
//   //     }
//   //   }

//   //   if (Math.ceil(videoRef.current!.duration - previousTime) <= 2) {
//   //     if (!inductionStatus) {
//   //       // setInductionStatus(true)
//   //       updateInduction()
//   //     }
//   //   }

//   //   setPreviousTime(currentTime)
//   //   setCurrentTime(videoRef.current!.currentTime)
//   // }
//   // const handleOnSeeking = () => {
//   //   if (videoRef.current!.currentTime > currentTime) {
//   //     videoRef.current!.currentTime = previousTime
//   //   }
//   //   if (data?.induction) {
//   //     return
//   //   }

//   //   const delta = videoRef.current!.currentTime - previousTime
//   //   if (delta > 0) {
//   //     videoRef.current!.currentTime = previousTime
//   //   }
//   // }

//   return (
//     <div className="w-full border-1">
//       <video
//         controls={true}
//         ref={videoRef}
//         onEnded={handleOnEnd}
//         // onTimeUpdate={handleTimeUpdate}
//         // onSeeking={handleOnSeeking}
//       >
//         <source src={Media} type="video/mp4" />
//       </video>
//     </div>
//   )
//   // return (
//   //   <ReactPlayer
//   //        config={{
//   //          file: { attributes: { controlsList: 'nodownload' } }
//   //        }}
//   //        onContextMenu={(e) => e.preventDefault()}
//   //        url={Media} // Replace with your video URL
//   //        controls // Enable video player controls
//   //        width="100%"
//   //        height="auto"
//   //        ref={videoRef}
//   //       //  onProgress={() => {
//   //       //    videoRef.current!.getCurrentTime() >= played &&
//   //       //        setPlayed(videoRef.current!.getCurrentTime())
//   //       //  }}
//   //       // onSeeking={() => {

//   //       // }}
//   //       //  onSeek={() => {
//   //       //    videoRef.current!.getCurrentTime() > played &&
//   //       //        videoRef.current!.seekTo(played)
//   //       //  }}
//   //   />
//   // )
// }

import React, { useRef, useState, useEffect } from 'react'
import Media from '@/assets/induction-video.mp4'
import { Button } from '../ui/button'
import { CirclePause, FastForward, Play, Rewind } from 'lucide-react'
import { Progress } from '../ui/progress'
import useFetchApprenticeDetails from '@/hooks/apprentice/useFetchApprenticeDetails'
import { toast } from 'sonner'

const Video = () => {
  const { query } = useFetchApprenticeDetails()
  const playerRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState<boolean>(false)
  const [isEnded, setIsEnded] = useState<boolean>(false)
  const [previousTime, setPreviousTime] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState<number>(0)

  useEffect(() => {
    const handleLoadedMetadata = () => {
      if (playerRef.current) {
        setDuration(playerRef.current.duration)
      }
    }
    const videoElement = playerRef.current
    if (videoElement) {
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata)
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata)
      }
    }
  }, [playerRef.current])

  const handleTimeUpdate = () => {
    if (query?.data?.induction) {
      return
    }

    if (Math.ceil(duration - previousTime) <= 59) {
      if (!query?.data?.induction) {
        // updateInduction()
        try {
          if (!isEnded) {
            setIsEnded(true)
            toast.success('You completed your induction!')
          }
        } catch (error) {
          setIsEnded(false)
          toast.success('Error occurred while ending the video!')
        }
      }
    }
    const currentTimeRunning = playerRef.current!.currentTime

    setCurrentTime(currentTimeRunning)
    if (currentTimeRunning >= previousTime) {
      setPreviousTime(playerRef.current!.currentTime)
    }
  }
  const handlePlayPause = () => {
    if (playing) {
      playerRef.current!.pause()
    } else {
      playerRef.current!.play()
    }
    setPlaying(!playing)
  }

  const handleRewind = () => {
    if (playerRef.current) {
      const newTime = Math.max(currentTime - 10, 0)
      playerRef.current.currentTime = newTime
    }
  }

  const handleFastForward = () => {
    if (playerRef.current) {
      const newTime = Math.min(currentTime + 10, previousTime)
      playerRef.current!.currentTime = newTime
    }
  }

  return (
    <div className="w-full border-1">
          <video
          controls={query?.data?.induction}
          ref={playerRef}
          onTimeUpdate={handleTimeUpdate}
       >
         <source src={Media} type="video/mp4" />
      </video>
      {!query?.data?.induction && (
        <>
          <div className='px-4 py-2 flex flex-col'>
            <Progress value={(currentTime / duration) * 100} className="w-full bg-gray-300 h-3" />
            <div className='px-1 flex justify-between'>
            <p className='text-sm'>{Math.floor(currentTime / 60) + ':' + Math.floor(currentTime % 60)}</p>
            <p className='text-sm'>{Math.floor(duration / 60) + ':' + Math.floor(duration % 60)}</p>
            </div>
          </div>
              <div className="w-full flex justify-between py-2 px-6">
            <Button onClick={handleRewind} className='flex gap-2'><Rewind /> 10s</Button>
            <Button onClick={handlePlayPause}>{playing ? <CirclePause /> : <Play />}</Button>
            <Button onClick={handleFastForward} className='flex gap-2'> 10s <FastForward /></Button>
          </div>
        </>
      )}

    </div>
  )
}

export default Video
