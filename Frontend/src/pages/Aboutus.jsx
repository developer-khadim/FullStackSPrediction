import React from 'react'
import ProfileCard from '../components/ProfileCard'
import khadim from '../assets/khadim.jpg'
import hamad from '../assets/hamad.jpg'

const Aboutus = () => {
  return (
    <div className="min-h-[calc(100vh-50px)] max-w-8xl container mx-auto px-2 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
          Meet Our Team
        </h1>
        <p className="text-lg text-gray-800 max-w-2xl mx-auto">
          Get to know the talented individuals who make our team extraordinary.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-16">
        <ProfileCard
          name="Khadim Ali"
          title="Full Stack Developer || Deep Learning Learner"
          handle="KhadimAli"
          status="Online"
          avatarUrl={khadim}
          showUserInfo={true}
          enableTilt={true}
          enableMobileTilt={false}
          socialLinks={{
            linkedin: 'https://www.linkedin.com/in/khadim-ali12/',
            github: 'https://github.com/developer-khadim',
            website: 'https://khadimali-devx1.vercel.app/'
          }}
        />

        <ProfileCard
          name="Hamad Ahmed"
          title="CS Student"
          handle="HamadAhmed"
          status="Available"
          avatarUrl={hamad}
          showUserInfo={true}
          enableTilt={true}
          enableMobileTilt={false}
          socialLinks={{
            linkedin: 'https://linkedin.com/in/hamadahmed',
            github: 'https://github.com/hamadahmed',
            website: 'https://hamadahmed.dev'
          }}
        />
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold text-indigo-500 mb-4">Our Mission</h2>
        <p className="text-gray-800 max-w-3xl mx-auto">
          We're passionate about creating innovative solutions that bridge the gap between technology and human needs. 
          Our team combines expertise in development, design, and data science to deliver exceptional products.
        </p>
      </div>
    </div>
  )
}

export default Aboutus
