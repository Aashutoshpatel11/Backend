import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import VideoCard from '../components/VideoCard';
import SubscribeBtn from '../assets/SubscribeBtn';

const ChannelPage = () => {
    const [activeTab, setActiveTab] = useState('videos');
    const {username} = useParams()
    const [userChannelData, setUserChannelData] = useState(null);
    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num;
    };

    const tabs = [
        { id: 'videos', name: 'Videos' },
        { id: 'playlists', name: 'Playlists' },
        { id: 'about', name: 'About' },
    ];

    const getChannelProfile = async() => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/c/${username}`, {withCredentials: true});
            setUserChannelData(response.data.data)
        } catch (error) {
            console.error("Error fetching channel profile:", error);
            throw new Error(error.message);
        }
    }

    useEffect(() => {
        getChannelProfile();
        
    }, [username]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-base-100 text-gray-900 dark:text-white">
            
            <div className="relative w-full">
                <div className="w-full h-48 sm:h-64 lg:h-80 bg-gray-700 dark:bg-gray-800">
                    {userChannelData?.coverImage && (
                        <img 
                            src={userChannelData?.coverImage} 
                            alt="Cover" 
                            className="w-full h-full object-cover" 
                        />
                    )}
                </div>

                <div className="absolute bottom-0 left-4 sm:left-6 lg:left-8 transform translate-y-1/2 flex items-center">
                    <img 
                        src={userChannelData?.avatar} 
                        alt="Avatar" 
                        className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-900 object-cover shadow-lg bg-gray-200 dark:bg-gray-700"
                    />

                    <div className="ml-4 hidden sm:block">
                        <h1 className="text-2xl sm:text-3xl font-bold">{userChannelData?.fullname}</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">@{userChannelData?.username}</p>
                    </div>
                </div>

                <div className="absolute bottom-4 right-4 sm:right-6 lg:right-8">
                    { userChannelData?._id && <SubscribeBtn channelId={userChannelData?._id} />}
                </div>
            </div>

            <div className="pt-14 sm:pt-16 lg:pt-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">

                <div className="sm:hidden mt-4"> 
                    <h1 className="text-2xl font-bold">{userChannelData?.fullname}</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">@{userChannelData?.username}</p>
                </div>
            </div>

            <div className="px-4 sm:px-6 lg:px-8 mt-4 sm:mt-0 pb-4"> {/* Adjusted mt-4 / sm:mt-0 */}
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>
                        <span className="font-bold">{formatNumber(userChannelData?.subscribers)}</span> Subscribers
                    </span>
                    <span>•</span>
                    <span>
                        <span className="font-bold">{userChannelData?.videos.length}</span> Videos
                    </span>
                </div>
            </div>


            <div className='divider' ></div>

            <nav className=" border-gray-200 dark:border-gray-700 sticky top-0 bg-gray-50 dark:bg-base-100 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-6 overflow-x-auto whitespace-nowrap">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    py-3 text-sm font-medium transition-colors duration-150 ease-in-out
                                    ${activeTab === tab.id 
                                        ? 'border-b-2 border-red-600 text-red-600 dark:text-red-500' 
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                    }
                                `}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'videos' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        { userChannelData && userChannelData?.videos.map(video => (
                            <VideoCard 
                            key={video?._id} 
                            src={video.thumbnail}
                            title={video.title}
                            views={Math.floor(video.views)}
                            createdAt={video.createdAt}
                            channelImageSrc={video.owner[0]?.avatar}
                            channelName={video.owner[0]?.username}
                            videoId={video._id}
                            duration={video.duration}
                            ownerId={video.owner[0]?._id}
                            />
                        ))}
                    </div>
                )}

                {activeTab === 'playlists' && (
                    <div className="text-center py-12">
                        Playlists coming soon...
                    </div>
                )}

                {activeTab === 'about' && (
                    <div className="bg-white p-6 rounded-lg shadow dark:bg-base-300">
                        <h3 className="text-lg font-semibold mb-3">About {userChannelData?.fullname}</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Joined on: {new Date(userChannelData?.createdAt).toLocaleDateString()}
                        </p>
                        <p className="mt-4 text-gray-600 dark:text-gray-300">
                            Welcome to the channel! We focus on creating engaging video content about technology and development.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ChannelPage;