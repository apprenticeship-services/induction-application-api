import { useRef, useState, useEffect } from 'react'
import Media from '@/assets/induction-video.mp4'
import { Button } from '../ui/button'
import { CirclePause, FastForward, Play, Rewind } from 'lucide-react'
import { Progress } from '../ui/progress'
import useFetchApprenticeDetails from '@/hooks/apprentice/useFetchApprenticeDetails'
import useLocalStorage from '@/hooks/local_storage/useLocalStorage'

const Video = () => {
  const { query, mutationInduction } = useFetchApprenticeDetails()
  const playerRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState<boolean>(false)
  const [previousTime, setPreviousTime] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState<number>(0)

  const [savedTime, setSavedTime] = useLocalStorage<number>('video-current-time', 0)

  useEffect(() => {
    const handleLoadedMetadata = () => {
      if (playerRef.current) {
        setDuration(playerRef.current.duration)
        if (!query?.data?.induction) {
          const resumeTime = savedTime
          playerRef.current.currentTime = resumeTime
          setCurrentTime(resumeTime)
          setPreviousTime(resumeTime)
        }
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
        mutationInduction.mutate()
      }
    }
    const currentTimeRunning = playerRef.current!.currentTime

    setCurrentTime(currentTimeRunning)
    if (currentTimeRunning >= previousTime) {
      setPreviousTime(playerRef.current!.currentTime)
      setSavedTime(playerRef.current!.currentTime)
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
      const newTime = Math.min(currentTime + 60)
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
