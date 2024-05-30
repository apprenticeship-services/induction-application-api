import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const BackOnLastPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate(-1)
  }, [])

  return <></>
}
