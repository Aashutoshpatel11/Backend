import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import VideoCardHorizontal from '../components/VideoCardHorizontal';

const MetricCard = ({ title, value }) => (
    <div className=" p-4 rounded-lg shadow-md border border-gray-100  dark:border-gray-700">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">{title}</p>
        <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
);

export default function DashboardPage() {
    const {userId} = useParams()
    const [stats, setStats] = useState()
    const [channelVideos, setChannelVideos] = useState()


    // GET RPOFILE STATS
    const getDashboardStats = async () => {
        try {
            const response = await axios.get( `${import.meta.env.VITE_SERVER_URL}/dashboard/stats/${userId}` )
            console.log("STATS", response);
            setStats(response.data.data)
        } catch (error) {
            console.log("GET Dashboard STATS::ERROR",error.message);
            throw new Error(error)
        }
    }

    useEffect( ()=>{
        getDashboardStats()
    }, [] )

    // GET CHANNEL VIDEOS
    const getChannelVideos = async () => {
        try {
            const response = await axios.get( `${import.meta.env.VITE_SERVER_URL}/dashboard/videos/${userId}` )
            // console.log("GET CHANNEL VIDEOS::", response.data.data);
            setChannelVideos(response.data.data)
        } catch (error) {
            console.log("GET CHANNEL VIDEOS::ERROR",error.message);
            throw new Error(error)
        }
    }

    useEffect( ()=>{
        getChannelVideos()
    }, [] )

  return (
    <div className="min-h-screen p-10 md:px-12 lg:px-14 xl:px-30">
        <header className="mb-8">
            <h1 className="text-3xl font-extrabold ">
                {stats && stats?.channel.username}
            </h1>
        </header>

        <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 ">
                Performance
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-4">
                <MetricCard title="Total Likes" value={Math.floor(stats?.likes)} />
                <MetricCard title="Total Videos" value={Math.floor(stats?.videos)} />
                <MetricCard title="Total Subscribers" value={Math.floor(stats?.subscribers)} />
                <MetricCard title="Total Views" value={Math.floor(stats?.views)} />
            </div>
        </section>

        <hr className="border-gray-200 dark:border-gray-700 mb-8" />

        <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 dark:text-gray-200">
                All Published Videos ({channelVideos?.length})
            </h2>

            <div className="space-y-4">
                {channelVideos?.length > 0 ? (
                    channelVideos.map((video) => (
                        <VideoCardHorizontal 
                        key={video._id} 
                        thumbnail={video.thumbnail}
                        title={video.title}
                        channelName={video.owner?.username}
                        views={video.views}
                        createdAt={video.createdAt}
                        videoId={video._id}
                        duration={video.duration}
                        ownerId={video.owner?._id}
                        />
                    ))
                ) : (
                    <p className="text-gray-600 dark:text-gray-400">No videos published yet.</p>
                )}
            </div>
        </section>
    </div>
  )
}
