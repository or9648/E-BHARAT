import React, { useContext } from 'react';
import Layout from '../components/Layout';
import HeroSection from '../components/HeroSection';
import Category from '../components/Category';
import Homepagecard from '../components/Homepagecard';
import Track from '../components/Track';
import Testimonial from '../components/Testimonial';
import Loader from '../components/Loader';


function Home() {
 

  return (
    <div>
      <Layout>
        <HeroSection />
        <Category />
        <Homepagecard />
        <Track />
        <Testimonial />
        {/* Render the value of name from context */}

      </Layout>
    </div>
  );
}

export default Home;
