import React from 'react'
import useSubscribe from './useSubscribe'


function SubscribeBtn({channelId}) {
    const {isSubscribed, toggleSubscribe } = useSubscribe(channelId)
  return (
    <button
    className={`btn rounded-full btn-md text-black ${isSubscribed? 'bg-white' : 'bg-error'} hover:bg-white/50`}
    type="button"
    onClick={() => toggleSubscribe()}
    >{isSubscribed? 'Unsubscribe' : 'Subscribe' }</button>
  )
}

export default SubscribeBtn;