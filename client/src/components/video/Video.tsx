import { useState, useRef } from 'react'
import Media from '@/assets/induction-video.mp4'
import { toast } from 'sonner'
// import { AxiosError } from 'axios'

export const Video = () => {
  const [isEnded, setIsEnded] = useState<boolean>(false)
  // const [previousTime, setPreviousTime] = useState(0)
  // const [currentTime, setCurrentTime] = useState(0)
  // // const { data, inductionStatus, setInductionStatus } = useInduction()
  // const data = {
  //   induction: false
  // }
  // const inductionStatus = false

  // const updateInduction = async () => {
  //   try {
  //     // const response = await axios.put('/api/apprentice/induction')
  //     // if (response.status === 204) {
  //     //   toast.success('Induction Completed')
  //     // }
  //     toast.success('Induction Completed')
  //   } catch (error) {
  //     const e = error as AxiosError
  //     toast.error(e.response?.data as string)
  //   }
  // }

  const handleOnEnd = () => {
    try {
      if (!isEnded) {
        console.log('ended')
        setIsEnded(true)
        toast.success('You completed your induction!')
      }
    } catch (error) {
      setIsEnded(false)
    }
  }

  const videoRef = useRef<HTMLVideoElement>(null)
  // const handleTimeUpdate = () => {
  //   if (data?.induction) {
  //     return
  //   }
  //   if (!videoRef.current!.seeking) {
  //     if (videoRef.current!.currentTime > previousTime) {
  //       setPreviousTime(videoRef.current!.currentTime)
  //     }
  //   }

  //   if (Math.ceil(videoRef.current!.duration - previousTime) <= 2) {
  //     if (!inductionStatus) {
  //       // setInductionStatus(true)
  //       updateInduction()
  //     }
  //   }

  //   setPreviousTime(currentTime)
  //   setCurrentTime(videoRef.current!.currentTime)
  // }
  // const handleOnSeeking = () => {
  //   if (videoRef.current!.currentTime > currentTime) {
  //     videoRef.current!.currentTime = previousTime
  //   }
  //   if (data?.induction) {
  //     return
  //   }

  //   const delta = videoRef.current!.currentTime - previousTime
  //   if (delta > 0) {
  //     videoRef.current!.currentTime = previousTime
  //   }
  // }

  return (
    <div className="w-full border-1">
      <video
        controls={true}
        ref={videoRef}
        onEnded={handleOnEnd}
        // onTimeUpdate={handleTimeUpdate}
        // onSeeking={handleOnSeeking}
      >
        <source src={Media} type="video/mp4" />
      </video>
    </div>
  )
  // return (
  //   <ReactPlayer
  //        config={{
  //          file: { attributes: { controlsList: 'nodownload' } }
  //        }}
  //        onContextMenu={(e) => e.preventDefault()}
  //        url={Media} // Replace with your video URL
  //        controls // Enable video player controls
  //        width="100%"
  //        height="auto"
  //        ref={videoRef}
  //       //  onProgress={() => {
  //       //    videoRef.current!.getCurrentTime() >= played &&
  //       //        setPlayed(videoRef.current!.getCurrentTime())
  //       //  }}
  //       // onSeeking={() => {

  //       // }}
  //       //  onSeek={() => {
  //       //    videoRef.current!.getCurrentTime() > played &&
  //       //        videoRef.current!.seekTo(played)
  //       //  }}
  //   />
  // )
}
